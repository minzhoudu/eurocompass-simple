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
      <label className="text-lg font-semibold text-ink">
        {text} {required && <span className="text-danger">*</span>}
      </label>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="rounded-lg border border-line-strong bg-raised px-1 py-2 text-ink focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200 disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-subtle"
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
