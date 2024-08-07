import { ChangeEvent } from "react";

type FormSelectProps = {
  options: string[];
  name: string;
  text: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const FormSelect = ({
  name,
  options,
  text,
  value,
  required,
  disabled,
  onChange,
}: FormSelectProps) => {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <label className="text-lg">
        {text} {required && <span className="text-red-700">*</span>}
      </label>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="rounded-lg border px-1 py-2"
        required={required}
      >
        <option value="" disabled>
          Izaberite opciju
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
