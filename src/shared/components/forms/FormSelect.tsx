import { ChangeEvent } from "react";

type FormSelectProps = {
  options: string[];
  name: string;
  text: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const FormSelect = ({
  name,
  options,
  text,
  required,
  disabled,
  onChange,
}: FormSelectProps) => {
  return (
    <div className="mt-5 flex flex-col items-center gap-2">
      <label className="text-lg">
        {text} {required && <span className="text-red-700">*</span>}
      </label>

      <select
        name={name}
        defaultValue=""
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
