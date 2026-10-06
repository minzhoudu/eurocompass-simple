import { useId } from "react";

type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

// A native <select> on purpose: phones show their own touch-friendly picker.
export const SelectField = ({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-line-strong bg-raised px-3 text-ink focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
