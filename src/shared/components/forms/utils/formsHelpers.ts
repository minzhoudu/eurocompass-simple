import {
  BEOGRAD_TIME_OPTIONS,
  BEOGRAD_TIME_OPTIONS_WEEKEND,
  CITIES,
  FORM_INPUTS,
  KRUSEVAC_TIME_OPTIONS,
} from "./constants";

type FormInputNames = (typeof FORM_INPUTS)[number]["name"];

export type FormData = {
  [key: FormInputNames]: string;
};

export type DepartureSchedule = {
  krusevac: string[];
  beograd: string[];
  beogradSunday: string[];
};

export const DEFAULT_SCHEDULE: DepartureSchedule = {
  krusevac: KRUSEVAC_TIME_OPTIONS,
  beograd: BEOGRAD_TIME_OPTIONS,
  beogradSunday: BEOGRAD_TIME_OPTIONS_WEEKEND,
};

const WEEKDAYS = ["ned", "pon", "uto", "sre", "čet", "pet", "sub"];

const pad = (value: number) => String(value).padStart(2, "0");

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// "YYYY-MM-DD" parsed as a local date; `new Date(string)` would read it as UTC.
const parseDateValue = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export const getCityName = (location: string) => location.split(" - ")[0];

export const getStationName = (location: string) =>
  location.split(" - ").slice(1).join(" - ");

export const CITY_NAMES = [...new Set(CITIES.map(getCityName))];

export const getStationsForCity = (city: string) =>
  CITIES.filter((location) => getCityName(location) === city);

const sortedUnique = (times: string[]) => [...new Set(times)].sort();

export const getTravelTimes = (
  startingLocation: string,
  date: string,
  schedule: DepartureSchedule = DEFAULT_SCHEDULE,
) => {
  if (startingLocation.includes("Kruševac")) {
    return sortedUnique(schedule.krusevac);
  }

  if (startingLocation.includes("Beograd")) {
    const isSunday = date !== "" && parseDateValue(date).getDay() === 0;

    if (!isSunday) return sortedUnique(schedule.beograd);

    return sortedUnique([...schedule.beograd, ...schedule.beogradSunday]);
  }

  return [];
};

export const isDeparturePassed = (
  date: string,
  time: string,
  now: Date = new Date(),
) => {
  if (!date || !time) return false;

  const [hours, minutes] = time.split(":").map(Number);
  const departure = parseDateValue(date);
  departure.setHours(hours, minutes, 0, 0);

  return departure.getTime() <= now.getTime();
};

export const getCurrentDate = () => toDateValue(new Date());

export const getUpcomingDates = (count: number, from: Date = new Date()) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + index,
    );
    const label =
      index === 0 ? "danas" : index === 1 ? "sutra" : WEEKDAYS[date.getDay()];

    return {
      value: toDateValue(date),
      label,
      display: `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`,
    };
  });

export const getFormattedDate = (date: string) => {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
};

export const getFormErrors = (
  formData: FormData,
  schedule: DepartureSchedule = DEFAULT_SCHEDULE,
) => {
  const errors: Record<string, string> = {};

  FORM_INPUTS.forEach((input) => {
    const value = (formData[input.name] ?? "").trim();

    if (input.required && !value) {
      errors[input.name] = input.errorMessage;
    } else if (input.isValid && !input.isValid(value)) {
      errors[input.name] = input.invalidMessage ?? input.errorMessage;
    }
  });

  if (!CITIES.includes(formData.startingLocation)) {
    errors.startingLocation = "Izaberite polaznu stanicu";
  }

  if (!formData.date) {
    errors.date = "Izaberite datum polaska";
  } else if (formData.date < getCurrentDate()) {
    errors.date = "Datum polaska ne može biti u prošlosti";
  }

  const availableTimes = getTravelTimes(
    formData.startingLocation,
    formData.date,
    schedule,
  );

  if (
    !availableTimes.includes(formData.time) ||
    isDeparturePassed(formData.date, formData.time)
  ) {
    errors.time = "Izaberite vreme polaska";
  }

  if (!(Number(formData.numberOfTickets) >= 1)) {
    errors.numberOfTickets = "Broj mesta mora biti najmanje 1";
  }

  return errors;
};

export const formatFormValues = (formData: FormData) => {
  const copyFormData = { ...formData };

  Object.keys(copyFormData).forEach((key) => {
    if (typeof copyFormData[key] === "string") {
      copyFormData[key] = copyFormData[key].trim();
    }

    if (key === "date") {
      copyFormData[key] = getFormattedDate(copyFormData[key]);
    }
  });

  return copyFormData;
};
