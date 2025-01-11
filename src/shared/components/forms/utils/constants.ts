import { HTMLInputTypeAttribute } from "react";

export type FormInputType = {
  id: number;
  name: string;
  type: HTMLInputTypeAttribute;
  text: string;
  placeholder: string;
  required: boolean;
  pattern?: string;
  errorMessage: string;
};

export const FORM_INPUTS: FormInputType[] = [
  {
    id: 1,
    name: "fullName",
    type: "text",
    text: "Prezime i ime",
    placeholder: "Unesite svoje prezime i ime",
    required: true,
    errorMessage: "Ovo polje je obavezno",
  },
  {
    id: 2,
    name: "email",
    type: "email",
    text: "Email adresa",
    placeholder: "Unesite svoju Email adresu",
    required: true,
    errorMessage: "Ovo polje je obavezno",
  },
  {
    id: 3,
    name: "phone",
    type: "number",
    text: "Broj telefona",
    placeholder: "(npr. 0631234567)",
    required: true,
    errorMessage: "Ovo polje je obavezno",
  },
];

export const CITIES = [
  "Kruševac - Glavna autobuska stanica",
  "Kruševac - Gornja pijaca",
  "Kruševac - Polazna stanica Varvarin",
  "Beograd - Glavna autobuska stanica",
  "Beograd - Autokomanda",
];

export const KRUSEVAC_TIME_OPTIONS = ["07:00", "13:00", "17:30"];
export const BEOGRAD_TIME_OPTIONS = ["09:40", "12:50", "18:00"];
export const BEOGRAD_TIME_OPTIONS_WEEKEND = [
  "09:40",
  "12:50",
  "18:00",
  "21:00",
];
