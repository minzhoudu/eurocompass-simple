import { IoAdd, IoRemove } from "react-icons/io5";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

const stepperButtonClasses =
  "flex size-11 items-center justify-center rounded-lg border border-line-strong bg-raised text-ink transition-colors hover:border-brand-yellow-500 hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 disabled:cursor-not-allowed disabled:opacity-40";

export const QuantityStepper = ({
  value,
  onChange,
  min = 1,
}: QuantityStepperProps) => (
  <div className="inline-flex items-center gap-3">
    <button
      type="button"
      aria-label="Smanji broj mesta"
      disabled={value <= min}
      onClick={() => onChange(value - 1)}
      className={stepperButtonClasses}
    >
      <IoRemove className="size-5" />
    </button>

    <output
      aria-live="polite"
      className="w-10 text-center text-xl font-bold text-ink"
    >
      {value}
    </output>

    <button
      type="button"
      aria-label="Povećaj broj mesta"
      onClick={() => onChange(value + 1)}
      className={stepperButtonClasses}
    >
      <IoAdd className="size-5" />
    </button>
  </div>
);
