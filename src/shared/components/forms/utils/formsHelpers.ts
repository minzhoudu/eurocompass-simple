import {
  BEOGRAD_TIME_OPTIONS,
  FORM_INPUTS,
  KRUSEVAC_TIME_OPTIONS,
} from "./constants";

type FormInputNames = (typeof FORM_INPUTS)[number]["name"];

export type FormData = {
  [key: FormInputNames]: string;
};

export const getTravelTimes = (startingLocation: string) => {
  if (startingLocation.includes("Kruševac")) {
    return KRUSEVAC_TIME_OPTIONS;
  }

  if (startingLocation.includes("Beograd")) {
    return BEOGRAD_TIME_OPTIONS;
  }

  return [];
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getFormattedDate = (date: string) => {
  const [year, month, day] = date.split("-");

  return `${day}.${month}.${year}`;
};

export const validateFormData = (formData: FormData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { note, ...requiredFormData } = formData;

  return Object.values(requiredFormData).some((value) => !value);
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
