import {
  CITIES,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_TICKETS,
} from "../../../src/shared/components/forms/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s/().-]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
// Links are the usual payload of form spam; a genuine name or note has none.
// (A plain address like marko@gmail.com in a note is fine.)
const LINK_PATTERN = /https?:\/\/|www\./i;
// Control characters (incl. line breaks) are never valid in single-line fields;
// the free-text note may still contain line breaks and tabs.
// eslint-disable-next-line no-control-regex
const SINGLE_LINE_CONTROL = /[\u0000-\u001f\u007f]/;
// eslint-disable-next-line no-control-regex
const NOTE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const MAX_DAYS_AHEAD = 400;

export type ValidReservation = {
  fullName: string;
  email: string;
  phone: string;
  startingLocation: string;
  date: string; // DD.MM.YYYY, as the form sends it
  time: string;
  numberOfTickets: number;
  note: string;
};

type ValidationResult =
  | { ok: true; data: ValidReservation }
  | { ok: false; message: string };

const asText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

// "12.10.2026" -> "2026-10-12", or null if it is not a real calendar day.
const parseFormDate = (value: string) => {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);

  if (!match) return null;

  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(`${iso}T00:00:00Z`);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(iso)
    ? iso
    : null;
};

const addDays = (isoDate: string, days: number) =>
  new Date(Date.parse(`${isoDate}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);

// Today's calendar day in Belgrade ("YYYY-MM-DD").
export const getBelgradeToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Belgrade" }).format(now);

// The same rules as the booking form, re-checked on the server: anything that
// reaches the inbox has passed them, whatever sent it.
export const validateReservation = (
  formData: unknown,
  today: string,
): ValidationResult => {
  if (typeof formData !== "object" || formData === null) {
    return { ok: false, message: "Podaci nisu ispravni." };
  }

  const input = formData as Record<string, unknown>;
  const fullName = asText(input.fullName);
  const email = asText(input.email);
  const phone = asText(input.phone);
  const startingLocation = asText(input.startingLocation);
  const date = asText(input.date);
  const time = asText(input.time);
  const note = asText(input.note);
  const tickets = asText(input.numberOfTickets);

  if (fullName.length < 2 || fullName.length > MAX_NAME_LENGTH) {
    return { ok: false, message: "Unesite ispravno prezime i ime." };
  }
  if (SINGLE_LINE_CONTROL.test(fullName) || LINK_PATTERN.test(fullName)) {
    return { ok: false, message: "Ime ne može sadržati linkove." };
  }
  if (
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    SINGLE_LINE_CONTROL.test(email)
  ) {
    return { ok: false, message: "Unesite ispravnu email adresu." };
  }
  if (
    phone.length > MAX_PHONE_LENGTH ||
    !PHONE_PATTERN.test(phone) ||
    phone.replace(/\D/g, "").length < 6
  ) {
    return { ok: false, message: "Unesite ispravan broj telefona." };
  }
  if (!CITIES.includes(startingLocation)) {
    return { ok: false, message: "Izaberite polaznu stanicu." };
  }

  const isoDate = parseFormDate(date);

  if (!isoDate || isoDate < today || isoDate > addDays(today, MAX_DAYS_AHEAD)) {
    return { ok: false, message: "Izaberite ispravan datum polaska." };
  }
  if (!TIME_PATTERN.test(time)) {
    return { ok: false, message: "Izaberite vreme polaska." };
  }

  const numberOfTickets = /^\d{1,3}$/.test(tickets) ? Number(tickets) : 0;

  if (numberOfTickets < 1 || numberOfTickets > MAX_TICKETS) {
    return {
      ok: false,
      message: `Broj mesta mora biti između 1 i ${MAX_TICKETS}.`,
    };
  }
  if (note.length > MAX_NOTE_LENGTH) {
    return { ok: false, message: "Napomena je predugačka." };
  }
  if (NOTE_CONTROL.test(note) || LINK_PATTERN.test(note)) {
    return { ok: false, message: "Napomena ne može sadržati linkove." };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      startingLocation,
      date,
      time,
      numberOfTickets,
      note,
    },
  };
};
