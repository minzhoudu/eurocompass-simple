import { ChangeEvent, useId } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { cn } from "../../utils";
import { ChoiceButton } from "./ChoiceButton";
import { getCurrentDate, getFormattedDate, getUpcomingDates } from "./utils";

const QUICK_DATE_COUNT = 6;

type DateSelectorProps = {
  value: string;
  onChange: (date: string) => void;
};

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  const customDateInputId = useId();

  const quickDates = getUpcomingDates(QUICK_DATE_COUNT);
  const hasCustomDate =
    value !== "" && !quickDates.some((date) => date.value === value);

  const handleCustomDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) onChange(event.target.value);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {quickDates.map((date) => (
        <ChoiceButton
          key={date.value}
          variant="date"
          selected={value === date.value}
          onClick={() => onChange(date.value)}
        >
          <span className="text-xs">{date.label}</span>
          <span className="text-base font-bold">{date.display}</span>
        </ChoiceButton>
      ))}

      {/*
        iOS Safari only opens a date input's native picker on a direct tap on
        the input itself - calling showPicker()/focus() from another
        element's click handler silently does nothing there. So the real
        input sits on top of the visible tile (transparent, not hidden),
        making the tap itself the interaction, instead of a decorative
        button that tries to open it programmatically.
      */}
      <div className="relative">
        <input
          id={customDateInputId}
          type="date"
          min={getCurrentDate()}
          value={value}
          onChange={handleCustomDateChange}
          aria-label="Izaberite drugi datum polaska"
          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
        />

        <label
          htmlFor={customDateInputId}
          className={cn(
            "flex min-w-[4.5rem] flex-col items-center rounded-xl border px-3 py-2 text-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow-500",
            hasCustomDate
              ? "border-brand-yellow-500 bg-brand-yellow-500/10 text-accent-ink ring-1 ring-brand-yellow-500"
              : "border-line-strong bg-raised text-ink-muted",
          )}
        >
          <span className="text-xs">drugi</span>
          {hasCustomDate ? (
            <span className="text-base font-bold">
              {getFormattedDate(value).slice(0, 6)}
            </span>
          ) : (
            <IoCalendarOutline className="size-6" />
          )}
        </label>
      </div>
    </div>
  );
};
