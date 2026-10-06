import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { cn } from "../../utils";
import { CalendarDialog } from "./CalendarDialog";
import { ChoiceButton } from "./ChoiceButton";
import { getFormattedDate, getUpcomingDates } from "./utils";

const QUICK_DATE_COUNT = 6;

type DateSelectorProps = {
  value: string;
  onChange: (date: string) => void;
  // Days with no departures: shown struck through and not selectable.
  isDateBlocked?: (date: string) => boolean;
};

export const DateSelector = ({
  value,
  onChange,
  isDateBlocked,
}: DateSelectorProps) => {
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
      {quickDates.map((date) => {
        const isBlocked = !!isDateBlocked?.(date.value);

        return (
          <ChoiceButton
            key={date.value}
            variant="date"
            selected={value === date.value}
            disabled={isBlocked}
            title={isBlocked ? "Nema polazaka" : undefined}
            onClick={() => onChange(date.value)}
          >
            <span className="text-xs">{date.label}</span>
            <span
              className={cn("text-base font-bold", isBlocked && "line-through")}
            >
              {date.display}
            </span>
            {isBlocked && <span className="sr-only">nema polazaka</span>}
          </ChoiceButton>
        );
      })}

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
        isDateDisabled={isDateBlocked}
        onSelect={handleCustomDateSelect}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
};
