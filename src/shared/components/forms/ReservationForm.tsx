import { ChangeEvent, FormEvent, useState } from "react";

import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import {
  CITIES,
  FORM_INPUTS,
  FormData,
  getTravelTimes,
  validateFormData,
} from "./utils";
import { useSendEmail } from "../email";

export const ReservationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    startingLocation: "",
    date: "",
    time: "",
    note: "",
  });

  const { sendEmail } = useSendEmail({
    formData,
    subject: "Rezervacija karte",
  });

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const isFormInvalidValid = validateFormData(formData);

    if (isFormInvalidValid) {
      alert("Molimo Vas popunite sva polja!");
      return;
    }

    try {
      await sendEmail();

      alert("Uspešno ste rezervisali kartu!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        startingLocation: "",
        date: "",
        time: "",
        note: "",
      });
    } catch (error) {
      alert("Došlo je do greške prilikom slanja emaila!");
      console.log("Došlo je do greške prilikom slanja emaila!", error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => {
      if (event.target.name === "date") {
        return {
          ...prev,
          [event.target.name]: event.target.value,
          time: "",
        };
      }
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <form
      name="reservation-form"
      onSubmit={handleFormSubmit}
      className="flex flex-col"
      data-netlify="true"
    >
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
        value={formData.startingLocation}
        options={CITIES}
        onChange={onChange}
        required
      />

      <FormInput
        name="date"
        placeholder="Izaberite datum polaska"
        text="Izaberite datum polaska"
        type="date"
        value={formData.date}
        onChange={onChange}
        required
      />

      <FormSelect
        name="time"
        text="Izaberite vreme polaska"
        onChange={onChange}
        value={formData.time}
        options={getTravelTimes(formData.startingLocation, formData.date)}
        disabled={!formData.startingLocation || !formData.date}
        required
      />

      <FormInput
        name="note"
        text="Napomena"
        type="textarea"
        value={formData.note}
        placeholder="Unesite napomenu"
        onChange={onChange}
      />

      <button
        type="submit"
        className="mb-5 mt-7 self-center rounded-lg bg-primaryYellow px-4 py-2 text-lg font-bold disabled:opacity-50"
        disabled={loading}
      >
        {!loading ? "REZERVIŠI KARTU" : "SLANJE PODATAKA..."}
      </button>
    </form>
  );
};
