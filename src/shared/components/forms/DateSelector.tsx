import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { CalendarDialog } from "./CalendarDialog";
import { ChoiceButton } from "./ChoiceButton";
import { getFormattedDate, getUpcomingDates } from "./utils";

const QUICK_DATE_COUNT = 6;

type DateSelectorProps = {
  value: string;
  onChange: (date: string) => void;
};

export const DateSelector = ({ value, onChange }: DateSelectorProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const quickDates = getUpcomingDates(QUICK_DATE_COUNT);
  const hasCustomDate =
    value !== "" && !quickDates.some((date) => date.value === value);

  const handleCustomDateSelect = (date: string) => {
    onChange(date);
    setIsCalendarOpen(false);
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

      <ChoiceButton
        variant="date"
        selected={hasCustomDate}
        aria-haspopup="dialog"
        aria-label="Izaberite drugi datum polaska"
        onClick={() => setIsCalendarOpen(true)}
      >
        <span className="text-xs">drugi</span>
        {hasCustomDate ? (
          <span className="text-base font-bold">
            {getFormattedDate(value).slice(0, 6)}
          </span>
        ) : (
          <IoCalendarOutline className="size-6" />
        )}
      </ChoiceButton>

      <CalendarDialog
        open={isCalendarOpen}
        value={value}
        onSelect={handleCustomDateSelect}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
};
