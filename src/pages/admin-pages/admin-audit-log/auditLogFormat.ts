import { AuditEntityType, AuditLogEntry } from "../../../shared";

export const ENTITY_LABELS: Record<AuditEntityType, string> = {
  auth: "Prijave",
  reservation: "Rezervacije",
  notice: "Obaveštenja",
  blocked_date: "Blokirani termini",
  information: "Cene i informacije",
  user: "Nalozi",
  audit: "Istorija",
};

const FIELD_LABELS: Record<string, string> = {
  // notices
  message: "Poruka",
  severity: "Vrsta",
  startsOn: "Počinje",
  endsOn: "Završava se",
  isEnabled: "Uključeno",
  // blocked dates
  city: "Grad",
  time: "Vreme polaska",
  reason: "Razlog",
  // information
  regularPrice: "Cena karte",
  roundtripPrice: "Cena povratne karte",
  studentPrice: "Cena studentske karte",
  importantInfo: "Važne informacije",
  startingTimesKrusevac: "Polasci iz Kruševca",
  startingTimesBeograd: "Polasci iz Beograda",
  saturdayBeograd: "Subotnji polasci iz Beograda",
  // reservations
  fullName: "Ime i prezime",
  startingLocation: "Polazak",
  travelDate: "Datum putovanja",
  travelTime: "Vreme putovanja",
  numberOfTickets: "Mesta",
  // accounts
  firstName: "Ime",
  lastName: "Prezime",
  email: "Email",
  role: "Uloga",
  isActive: "Aktivan",
  // deleted audit entry
  entrySummary: "Obrisani zapis",
  entryActor: "Zapis je napravio",
  entryTime: "Vreme zapisa",
};

const SEVERITY_LABELS: Record<string, string> = {
  info: "Obaveštenje",
  warning: "Upozorenje",
  danger: "Hitno",
};

const ROLE_LABELS: Record<string, string> = {
  owner: "Vlasnik",
  admin: "Administrator",
};

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// The database returns JSON keys in its own order; show them as listed above.
const FIELD_ORDER = Object.keys(FIELD_LABELS);

export const sortByFieldOrder = <T>(fields: [string, T][]) =>
  [...fields].sort(
    ([a], [b]) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b),
  );

export const getFieldLabel = (field: string) => FIELD_LABELS[field] ?? field;

export const formatValue = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "da" : "ne";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(String).join(", ") : "—";
  }

  const text = String(value);

  if (field === "severity") return SEVERITY_LABELS[text] ?? text;
  if (field === "role") return ROLE_LABELS[text] ?? text;

  const date = DATE_PATTERN.exec(text);

  return date ? `${date[3]}.${date[2]}.${date[1]}` : text;
};

export const getActorLabel = (entry: AuditLogEntry) => {
  if (entry.actorEmail) {
    return entry.actorName?.trim() || entry.actorEmail;
  }

  return entry.action === "auth.login_failed"
    ? "Neprijavljen posetilac"
    : "Automatski (sistem)";
};

// Entries are grouped under their Belgrade calendar day.
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Belgrade",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const getEntryDay = (iso: string) => dayFormatter.format(new Date(iso));

export const formatEntryTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("sr-RS", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
  });
