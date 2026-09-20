import { ChangeEvent, FocusEvent, HTMLInputTypeAttribute, useRef } from "react";
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
  min?: string | number;
};

const fieldClasses =
  "mt-2 w-full rounded-lg border border-line-strong bg-raised p-2 text-ink placeholder:text-ink-subtle focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200 [&:user-invalid]:border-red-500 [&:user-invalid]:text-danger [&:focus:user-invalid]:ring-red-200";

export const FormInput = ({
  text,
  name,
  required,
  pattern,
  onChange,
  value,
  placeholder,
  type,
  min,
}: FormInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.type === "date" && e.target.showPicker) {
      e.target.showPicker();
    }
  };
  return (
    <div className="mt-6 flex flex-col">
      <label htmlFor={name} className="text-lg font-semibold text-ink">
        {text} {required && <span className="text-danger">*</span>}
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
          className={fieldClasses}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type || "text"}
          min={min ?? (type === "date" ? getCurrentDate() : undefined)}
          placeholder={placeholder}
          value={value}
          required={required}
          pattern={pattern}
          onChange={onChange}
          className={`${fieldClasses} appearance-none text-center`}
          ref={inputRef}
          onFocus={handleFocus}
        />
      )}
    </div>
  );
};
