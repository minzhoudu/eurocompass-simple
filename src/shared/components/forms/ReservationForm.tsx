import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { IoCallOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";

import { useInformation } from "../../hooks/useInformation";
import { useSendEmail } from "../email";
import { Alert, Button } from "../ui";
import { ChoiceButton } from "./ChoiceButton";
import { DateSelector } from "./DateSelector";
import { FormInput } from "./FormInput";
import { FieldGroup, FieldLabel, FormSection } from "./FormSection";
import { QuantityStepper } from "./QuantityStepper";
import { ReservationSuccess } from "./ReservationSuccess";
import {
  CITY_NAMES,
  DEFAULT_SCHEDULE,
  DepartureSchedule,
  FORM_INPUTS,
  FormData,
  getCityName,
  getFormErrors,
  getStationName,
  getStationsForCity,
  getTravelTimes,
  isDeparturePassed,
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

export const ReservationForm = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [city, setCity] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const [confirmation, setConfirmation] = useState<FormData | null>(null);

  const { data } = useInformation();
  const info = data?.info;

  const schedule = useMemo<DepartureSchedule>(
    () =>
      info
        ? {
            krusevac: info.startingTimesKrusevac ?? [],
            beograd: info.startingTimesBeograd ?? [],
            beogradSunday: info.saturdayBeograd ?? [],
          }
        : DEFAULT_SCHEDULE,
    [info],
  );

  const { sendEmail } = useSendEmail({
    formData,
    subject: "Rezervacija karte",
  });

  const errors = getFormErrors(formData, schedule);
  const visibleError = (name: string) =>
    showAllErrors || touched[name] ? errors[name] : undefined;

  const times = getTravelTimes(formData.startingLocation, formData.date, schedule);
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
        ) && !isDeparturePassed(date, prev.time);

      return { ...prev, date, time: keepTime ? prev.time : "" };
    });

  const selectTime = (time: string) =>
    setFormData((prev) => ({ ...prev, time }));

  const setNumberOfTickets = (count: number) =>
    setFormData((prev) => ({ ...prev, numberOfTickets: String(count) }));

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setCity("");
    setNoteOpen(false);
    setTouched({});
    setShowAllErrors(false);
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
    setSendFailed(false);

    const firstInvalidField = ERROR_FOCUS_ORDER.find((name) => errors[name]);

    if (firstInvalidField) {
      focusField(firstInvalidField);
      return;
    }

    setLoading(true);

    try {
      await sendEmail();

      setConfirmation(formData);
      resetForm();
    } catch (error) {
      setSendFailed(true);
      console.error("Došlo je do greške prilikom slanja emaila!", error);
    } finally {
      setLoading(false);
    }
  };

  if (confirmation) {
    return (
      <ReservationSuccess
        data={confirmation}
        onReset={() => setConfirmation(null)}
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
      <FormSection step={1} title="Putnik">
        {selectedInputs(["fullName"]).map(renderInput)}

        <div className="grid gap-5 sm:grid-cols-2">
          {selectedInputs(["email", "phone"]).map(renderInput)}
        </div>
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
          <DateSelector value={formData.date} onChange={selectDate} />
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
          ) : times.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Nema polazaka za izabranu stanicu.
            </p>
          ) : allTimesPassed ? (
            <p className="text-sm text-ink-muted">
              Svi polasci za danas su već prošli. Izaberite drugi datum.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <ChoiceButton
                  key={time}
                  selected={formData.time === time}
                  disabled={isDeparturePassed(formData.date, time)}
                  onClick={() => selectTime(time)}
                >
                  {time}
                </ChoiceButton>
              ))}
            </div>
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

      {sendFailed && (
        <Alert variant="error" role="alert">
          Došlo je do greške prilikom slanja emaila!
        </Alert>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {!loading ? "REZERVIŠI KARTU" : "SLANJE PODATAKA..."}
      </Button>
    </form>
  );
};
