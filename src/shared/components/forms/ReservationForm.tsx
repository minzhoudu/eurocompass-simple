import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import { IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";

import { CreateReservationDto } from "../../dtos/CreateReservation";
import { useCreateReservation } from "../../hooks/useCreateReservation";
import {
  useBlockedDates,
  useFetchLatestBlockedDates,
} from "../../hooks/useBlockedDates";
import { useDepartureSchedule } from "../../hooks/useDepartureSchedule";
import { getSendEmailErrorMessage, useSendEmail } from "../email";
import { Alert, Button } from "../ui";
import { ChoiceButton } from "./ChoiceButton";
import { DateSelector } from "./DateSelector";
import { FormInput } from "./FormInput";
import { FieldGroup, FieldLabel, FormSection } from "./FormSection";
import { QuantityStepper } from "./QuantityStepper";
import { ReservationSuccess } from "./ReservationSuccess";
import {
  CITY_NAMES,
  findDayBlock,
  findDepartureBlock,
  FORM_INPUTS,
  FormData,
  getCityName,
  getCurrentDate,
  getDepartureBlockMessage,
  getFormErrors,
  clearSavedPassenger,
  HONEYPOT_FIELD,
  loadSavedPassenger,
  MIN_FILL_TIME_MS,
  savePassenger,
  getStationName,
  getStationsForCity,
  getTravelTimes,
  isDeparturePassed,
  MAX_NOTE_LENGTH,
  MAX_TICKETS,
} from "./utils";

const EMPTY_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  startingLocation: "",
  date: "",
  time: "",
  numberOfTickets: "1",
  note: "",
};

const FIELD_ICONS: Record<string, ReactNode> = {
  fullName: <IoPersonOutline className="size-5" />,
  email: <IoMailOutline className="size-5" />,
  phone: <IoCallOutline className="size-5" />,
};

const ERROR_FOCUS_ORDER = [
  "fullName",
  "email",
  "phone",
  "startingLocation",
  "date",
  "time",
  "numberOfTickets",
];

// The empty form, with the remembered passenger (if the customer opted in on an
// earlier visit) already filled in.
const getInitialFormData = (prefill?: Prefill): FormData => {
  const saved = loadSavedPassenger();
  const base = saved ? { ...EMPTY_FORM, ...saved } : EMPTY_FORM;

  if (!prefill) return base;

  // A link to a specific departure ("Rezerviši ovaj polazak" on the homepage):
  // the city is chosen, the date and time set. A remembered station only
  // stays if it belongs to that city.
  return {
    ...base,
    startingLocation:
      prefill.city && getCityName(base.startingLocation) !== prefill.city
        ? ""
        : base.startingLocation,
    date: prefill.date ?? base.date,
    time: prefill.time ?? base.time,
  };
};

type Prefill = { city?: string; date?: string; time?: string };

// Reads and validates ?grad=&datum=&vreme= (anything else is ignored).
const getPrefill = (params: URLSearchParams): Prefill => {
  const city = params.get("grad") ?? "";
  const date = params.get("datum") ?? "";
  const time = params.get("vreme") ?? "";

  return {
    city: CITY_NAMES.includes(city) ? city : undefined,
    date:
      /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= getCurrentDate()
        ? date
        : undefined,
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : undefined,
  };
};

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ReservationForm = () => {
  const [searchParams] = useSearchParams();
  const [prefill] = useState(() => getPrefill(searchParams));
  const [formData, setFormData] = useState<FormData>(() =>
    getInitialFormData(prefill),
  );
  // Opt-in: only people who ticked "remember me" before have anything saved,
  // so a loaded profile means the box starts ticked.
  const [rememberMe, setRememberMe] = useState(
    () => loadSavedPassenger() !== null,
  );
  const [hasSavedDetails, setHasSavedDetails] = useState(
    () => loadSavedPassenger() !== null,
  );
  const [city, setCity] = useState(
    () => prefill.city ?? getCityName(getInitialFormData().startingLocation),
  );
  const [noteOpen, setNoteOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // Bot checks: a hidden field only a script fills in, and how long the form
  // has been open (a person needs a few seconds; a script posts at once).
  const [honeypot, setHoneypot] = useState("");
  const formOpenedAt = useRef(Date.now());
  const [confirmation, setConfirmation] = useState<FormData | null>(null);

  const { schedule } = useDepartureSchedule();

  const { sendEmail } = useSendEmail({
    formData,
    subject: "Rezervacija karte",
  });
  const { mutate: createReservation } = useCreateReservation();

  const { blockedDates } = useBlockedDates();
  const fetchLatestBlockedDates = useFetchLatestBlockedDates();

  const errors = getFormErrors(formData, schedule, blockedDates);

  // Blocks apply to the chosen city, which is known as soon as its tile is
  // picked (before a station is).
  const activeCity = city || getCityName(formData.startingLocation);
  const isDateBlocked = (date: string) =>
    !!findDayBlock(blockedDates, date, activeCity);
  const isDayBlocked = formData.date !== "" && isDateBlocked(formData.date);
  const selectedTimeBlock =
    formData.time !== "" &&
    findDepartureBlock(blockedDates, formData.date, activeCity, formData.time);

  // A block is shown right away, not only after the field was touched or the
  // form submitted - the customer should see why they can't book it.
  const visibleError = (name: string) =>
    showAllErrors ||
    touched[name] ||
    (name === "date" && isDayBlocked) ||
    (name === "time" && selectedTimeBlock)
      ? errors[name]
      : undefined;

  const times = getTravelTimes(
    formData.startingLocation,
    formData.date,
    schedule,
  );
  const canPickTime = formData.startingLocation !== "" && formData.date !== "";
  const missingForTimes = !formData.startingLocation
    ? formData.date
      ? "Izaberite polaznu stanicu"
      : "Izaberite polaznu stanicu i datum"
    : "Izaberite datum";
  const allTimesPassed =
    times.length > 0 &&
    times.every((time) => isDeparturePassed(formData.date, time));

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = event.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const selectCity = (nextCity: string) => {
    setCity(nextCity);
    setFormData((prev) =>
      getCityName(prev.startingLocation) === nextCity
        ? prev
        : { ...prev, startingLocation: "", time: "" },
    );
  };

  const selectStation = (location: string) =>
    setFormData((prev) => ({ ...prev, startingLocation: location }));

  const selectDate = (date: string) =>
    setFormData((prev) => {
      const keepTime =
        getTravelTimes(prev.startingLocation, date, schedule).includes(
          prev.time,
        ) &&
        !isDeparturePassed(date, prev.time) &&
        !findDepartureBlock(blockedDates, date, activeCity, prev.time);

      return { ...prev, date, time: keepTime ? prev.time : "" };
    });

  const selectTime = (time: string) =>
    setFormData((prev) => ({ ...prev, time }));

  const setNumberOfTickets = (count: number) =>
    setFormData((prev) => ({ ...prev, numberOfTickets: String(count) }));

  // "Not you?": drop what is saved on this device and start from a blank form.
  const forgetSavedDetails = () => {
    clearSavedPassenger();
    setHasSavedDetails(false);
    setRememberMe(false);
    setFormData(EMPTY_FORM);
    setCity("");
    setTouched({});
    setShowAllErrors(false);
  };

  const resetForm = () => {
    const next = getInitialFormData();

    setFormData(next);
    setCity(getCityName(next.startingLocation));
    setNoteOpen(false);
    setTouched({});
    setShowAllErrors(false);
    setHoneypot("");
  };

  const focusField = (name: string) => {
    const element = document.getElementById(name);

    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus({ preventScroll: true });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (loading) return;

    setShowAllErrors(true);
    setSendError(null);

    const firstInvalidField = ERROR_FOCUS_ORDER.find((name) => errors[name]);

    if (firstInvalidField) {
      focusField(firstInvalidField);
      return;
    }

    setLoading(true);

    // The page may have been open for a while: re-check the blocked days with
    // fresh data before anything is sent. If the backend can't be reached in a
    // few seconds the cached list is used and the booking is not held up.
    const latestBlockedDates = await fetchLatestBlockedDates(blockedDates);
    const latestErrors = getFormErrors(formData, schedule, latestBlockedDates);

    if (latestErrors.date || latestErrors.time) {
      focusField(latestErrors.date ? "date" : "time");
      setLoading(false);
      return;
    }

    // A pre-filled form can be completed in a couple of seconds. Rather than
    // have the server turn that person away as "too fast", wait out the
    // remainder here (the button already says it is sending).
    const remaining =
      MIN_FILL_TIME_MS + 150 - (Date.now() - formOpenedAt.current);

    if (remaining > 0) await wait(remaining);

    const botChecks = {
      hp: honeypot,
      elapsedMs: Date.now() - formOpenedAt.current,
    };

    try {
      // The email is the reservation of record, and it is also where the
      // server-side bot checks and limits apply - so it goes first.
      await sendEmail(botChecks);

      // Then the booking is saved for the admin, but not awaited: the backend
      // can be slow to wake up (free-tier cold start), and its outcome
      // shouldn't gate or fail the customer's confirmation. A failure here
      // only means this one booking is missing from the admin stats.
      const reservationPayload: CreateReservationDto = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        startingLocation: formData.startingLocation,
        travelDate: formData.date,
        travelTime: formData.time,
        numberOfTickets: Number(formData.numberOfTickets),
        note: formData.note.trim() || undefined,
        ...botChecks,
      };

      createReservation(reservationPayload, {
        onError: (error) => {
          console.error(
            "Rezervacija nije sačuvana u bazi (statistika će biti nepotpuna), email je ipak poslat:",
            error,
          );
        },
      });

      // Only after the booking went through, and only if they ticked the box.
      if (rememberMe) {
        savePassenger({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          startingLocation: formData.startingLocation,
        });
        setHasSavedDetails(true);
      } else {
        clearSavedPassenger();
        setHasSavedDetails(false);
      }

      setConfirmation(formData);
      resetForm();
    } catch (error) {
      setSendError(getSendEmailErrorMessage(error));
      console.error("Došlo je do greške prilikom slanja emaila!", error);
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <ReservationSuccess
        data={confirmation}
        onReset={() => {
          setConfirmation(null);
          formOpenedAt.current = Date.now();
        }}
      />
    );
  }

  const stations = city ? getStationsForCity(city) : [];
  const selectedInputs = (names: string[]) =>
    FORM_INPUTS.filter((input) => names.includes(input.name));

  const renderInput = (input: (typeof FORM_INPUTS)[number]) => (
    <FormInput
      key={input.id}
      name={input.name}
      text={input.text}
      type={input.type}
      placeholder={input.placeholder}
      autoComplete={input.autoComplete}
      required={input.required}
      icon={FIELD_ICONS[input.name]}
      value={formData[input.name]}
      onChange={handleTextChange}
      maxLength={input.maxLength}
      onBlur={handleBlur}
      error={visibleError(input.name)}
    />
  );

  return (
    <form
      name="reservation-form"
      onSubmit={handleFormSubmit}
      noValidate
      className="flex flex-col gap-8"
      data-netlify="true"
    >
      {/* Bot trap: off-screen (not display:none, which bots skip), out of the
          tab order and hidden from screen readers. A person never fills it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-auto size-px overflow-hidden"
      >
        <label>
          Ne popunjavajte ovo polje
          <input
            type="text"
            name={HONEYPOT_FIELD}
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <FormSection step={1} title="Putnik">
        {hasSavedDetails && (
          <p className="flex flex-wrap items-center gap-x-2 rounded-lg bg-sunken px-3 py-2 text-sm text-ink-muted">
            Podaci su popunjeni iz vaše prethodne rezervacije.
            <button
              type="button"
              onClick={forgetSavedDetails}
              className="font-semibold text-accent-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
            >
              Nisam ja / zaboravi podatke
            </button>
          </p>
        )}

        {selectedInputs(["fullName"]).map(renderInput)}

        <div className="grid gap-5 sm:grid-cols-2">
          {selectedInputs(["email", "phone"]).map(renderInput)}
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-brand-yellow-500"
          />
          <span className="text-sm">
            <span className="font-semibold text-ink">
              Zapamti moje podatke na ovom uređaju
            </span>
            <span className="block text-ink-muted">
              Ime, email, telefon i polazna stanica se čuvaju samo u ovom
              pregledaču (ne na našem serveru), da sledeća rezervacija bude
              brža. Možete ih obrisati u bilo kom trenutku.
            </span>
          </span>
        </label>
      </FormSection>

      <FormSection step={2} title="Polazak">
        <FieldGroup
          id="startingLocation"
          label="Polazak iz"
          required
          error={visibleError("startingLocation")}
        >
          <div className="grid grid-cols-2 gap-3">
            {CITY_NAMES.map((name) => (
              <ChoiceButton
                key={name}
                variant="tile"
                selected={city === name}
                onClick={() => selectCity(name)}
              >
                <span className="block text-base font-bold">{name}</span>
                <span className="block text-xs font-normal">
                  Polazak za {CITY_NAMES.find((other) => other !== name)}
                </span>
              </ChoiceButton>
            ))}
          </div>

          {stations.length > 0 && (
            <div className="flex flex-col gap-2">
              <FieldLabel id="station-label" required>
                Polazna stanica
              </FieldLabel>

              <div
                role="group"
                aria-labelledby="station-label"
                className="flex flex-wrap gap-2"
              >
                {stations.map((location) => (
                  <ChoiceButton
                    key={location}
                    selected={formData.startingLocation === location}
                    onClick={() => selectStation(location)}
                  >
                    {getStationName(location)}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}
        </FieldGroup>

        <FieldGroup
          id="date"
          label="Datum polaska"
          required
          error={visibleError("date")}
        >
          <DateSelector
            value={formData.date}
            onChange={selectDate}
            isDateBlocked={isDateBlocked}
          />
        </FieldGroup>

        <FieldGroup
          id="time"
          label="Vreme polaska"
          required
          error={visibleError("time")}
        >
          {!canPickTime ? (
            <p className="text-sm text-ink-muted">
              {missingForTimes} da biste videli polaske.
            </p>
          ) : isDayBlocked ? (
            <p className="text-sm text-ink-muted">
              Za izabrani datum nema polazaka. Izaberite drugi datum.
            </p>
          ) : times.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Nema polazaka za izabranu stanicu.
            </p>
          ) : allTimesPassed ? (
            <p className="text-sm text-ink-muted">
              Svi polasci za danas su već prošli. Izaberite drugi datum.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {times.map((time) => (
                  <ChoiceButton
                    key={time}
                    selected={formData.time === time}
                    disabled={
                      isDeparturePassed(formData.date, time) ||
                      !!findDepartureBlock(
                        blockedDates,
                        formData.date,
                        activeCity,
                        time,
                      )
                    }
                    onClick={() => selectTime(time)}
                  >
                    {time}
                  </ChoiceButton>
                ))}
              </div>

              {times.map((time) => {
                const block = findDepartureBlock(
                  blockedDates,
                  formData.date,
                  activeCity,
                  time,
                );

                return block ? (
                  <p key={time} className="text-sm text-ink-muted">
                    {getDepartureBlockMessage(block, time)}
                  </p>
                ) : null;
              })}
            </>
          )}
        </FieldGroup>
      </FormSection>

      <FormSection step={3} title="Karte">
        <FieldGroup
          id="numberOfTickets"
          label="Broj mesta"
          required
          error={visibleError("numberOfTickets")}
        >
          <QuantityStepper
            value={Number(formData.numberOfTickets) || 1}
            onChange={setNumberOfTickets}
            max={MAX_TICKETS}
          />
        </FieldGroup>

        {noteOpen || formData.note ? (
          <FormInput
            name="note"
            text="Napomena"
            type="textarea"
            placeholder="Unesite napomenu"
            autoFocus={noteOpen && !formData.note}
            value={formData.note}
            maxLength={MAX_NOTE_LENGTH}
            onChange={handleTextChange}
          />
        ) : (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="self-start text-sm font-semibold text-accent-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500"
          >
            + Dodaj napomenu
          </button>
        )}
      </FormSection>

      {sendError && (
        <Alert variant="error" role="alert">
          {sendError}
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {!loading ? "REZERVIŠI KARTU" : "SLANJE PODATAKA..."}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        Slanjem forme prihvatate našu{" "}
        <Link
          to="/politika-privatnosti"
          className="font-semibold text-accent-ink hover:underline"
        >
          Politiku privatnosti
        </Link>
        .
      </p>
    </form>
  );
};
