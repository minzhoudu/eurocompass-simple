import { ChangeEvent, FormEvent, useState } from "react";

import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import {
  CITIES,
  FORM_INPUTS,
  FormData,
  getFormattedDate,
  getTravelTimes,
  validateFormData,
} from "./utils";

export const ReservationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    startingLocation: "",
    date: "",
    time: "",
    note: "",
  });

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const isFormInvalidValid = validateFormData(formData);

    if (isFormInvalidValid) {
      alert("Molimo Vas popunite sva polja!");
      return;
    }
  };

  const onChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]:
          event.target.name === "date"
            ? getFormattedDate(event.target.value)
            : event.target.value,
      };
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col">
      {FORM_INPUTS.map((input) => (
        <FormInput
          key={input.id}
          {...input}
          value={formData[input.name]}
          onChange={onChange}
        />
      ))}

      <FormSelect
        name="startingLocation"
        text="Izaberite polaznu lokaciju"
        options={CITIES}
        onChange={onChange}
        required
      />

      <FormInput
        name="date"
        text="Izaberite datum polaska"
        type="date"
        onChange={onChange}
        required
      />

      <FormSelect
        name="time"
        text="Izaberite vreme polaska"
        onChange={onChange}
        options={getTravelTimes(formData.startingLocation)}
        disabled={!formData.startingLocation}
        required
      />

      <FormInput
        name="note"
        text="Napomena"
        type="textarea"
        placeholder="Unesite napomenu"
        onChange={onChange}
      />

      <button
        type="submit"
        className="mb-5 mt-7 self-center rounded-lg bg-[#fff312c5] px-4 py-2 text-lg font-bold"
      >
        REZERVIŠI KARTU
      </button>
    </form>
  );
};
