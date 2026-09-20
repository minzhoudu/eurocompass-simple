import { useRef } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { ChoiceButton } from "./ChoiceButton";
import { getCurrentDate, getFormattedDate, getUpcomingDates } from "./utils";

const QUICK_DATE_COUNT = 6;

type DateSelectorProps = {
  value: string;
  onChange: (date: string) => void;
};

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const quickDates = getUpcomingDates(QUICK_DATE_COUNT);
  const hasCustomDate =
    value !== "" && !quickDates.some((date) => date.value === value);

  const openPicker = () => {
    const input = inputRef.current;

    if (!input) return;

    try {
      input.showPicker();
    } catch {
      input.focus();
    }
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

      <ChoiceButton variant="date" selected={hasCustomDate} onClick={openPicker}>
        <span className="text-xs">drugi</span>
        {hasCustomDate ? (
          <span className="text-base font-bold">
            {getFormattedDate(value).slice(0, 6)}
          </span>
        ) : (
          <IoCalendarOutline className="size-6" />
        )}
      </ChoiceButton>

      <input
        ref={inputRef}
        type="date"
        min={getCurrentDate()}
        value={value}
        onChange={(event) => event.target.value && onChange(event.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </div>
  );
};
