import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { getCurrentDate } from "./utils";

type FormInputProps = {
  text: string;
  name: string;
  required?: boolean;
  pattern?: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  value?: string;
  type?: HTMLInputTypeAttribute | "textarea";
  placeholder?: string;
};

export const FormInput = ({
  text,
  name,
  required,
  pattern,
  onChange,
  value,
  placeholder,
  type,
}: FormInputProps) => {
  return (
    <div className="mt-6 flex flex-col">
      <label htmlFor={name} className="text-lg">
        {text} {required && <span className="text-red-700">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className="mt-2 rounded-lg p-2 invalid:border invalid:border-red-600 invalid:text-red-600 focus:outline-none focus:invalid:border-red-600 focus:invalid:ring-red-600"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type || "text"}
          min={type === "date" ? getCurrentDate() : undefined}
          placeholder={placeholder}
          value={value}
          required={required}
          pattern={pattern}
          onChange={onChange}
          className="mt-2 appearance-none rounded-lg p-2 text-center invalid:border invalid:border-red-600 invalid:text-red-600 focus:outline-none focus:invalid:border-red-600 focus:invalid:ring-red-600"
        />
      )}
    </div>
  );
};
