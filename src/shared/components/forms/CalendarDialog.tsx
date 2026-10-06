import { useEffect, useId, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { cn } from "../../utils";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { getCurrentDate, parseDateValue, toDateValue } from "./utils";

const MONTHS = [
  "Januar",
  "Februar",
  "Mart",
  "April",
  "Maj",
  "Jun",
  "Jul",
  "Avgust",
  "Septembar",
  "Oktobar",
  "Novembar",
  "Decembar",
];

// Monday first.
const WEEKDAYS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];

type CalendarDialogProps = {
  open: boolean;
  value: string;
  // Admin views need to look at past days too; the booking form does not.
  allowPastDates?: boolean;
  onSelect: (date: string) => void;
  onClose: () => void;
};

const getMonthStart = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

// A custom calendar instead of <input type="date">: the native picker opens
// differently on iOS, Android and desktop browsers, so no single trick works
// everywhere. This behaves the same on every device.
export const CalendarDialog = ({
  open,
  value,
  allowPastDates = false,
  onSelect,
  onClose,
}: CalendarDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const today = getCurrentDate();
  const currentMonth = getMonthStart(parseDateValue(today));
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      setVisibleMonth(
        getMonthStart(
          parseDateValue(
            value && (allowPastDates || value >= today) ? value : today,
          ),
        ),
      );
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
    // Only re-run when opening/closing, not on every value change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (visibleMonth.getDay() + 6) % 7;
  const canGoBack = allowPastDates || visibleMonth > currentMonth;

  const shiftMonth = (offset: number) =>
    setVisibleMonth(new Date(year, month + offset, 1));

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-line bg-raised p-0 text-ink shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <IconButton
            label="Prethodni mesec"
            onClick={() => shiftMonth(-1)}
            disabled={!canGoBack}
          >
            <IoChevronBack className="size-5" />
          </IconButton>

          <h2 id={titleId} className="text-lg font-bold">
            {MONTHS[month]} {year}
          </h2>

          <IconButton label="Sledeći mesec" onClick={() => shiftMonth(1)}>
            <IoChevronForward className="size-5" />
          </IconButton>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="py-1 text-xs font-semibold uppercase text-ink-subtle"
            >
              {weekday}
            </span>
          ))}

          {Array.from({ length: leadingBlanks }, (_, index) => (
            <span key={`blank-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateValue = toDateValue(new Date(year, month, day));
            const isPast = !allowPastDates && dateValue < today;
            const isSelected = dateValue === value;

            return (
              <button
                key={dateValue}
                type="button"
                disabled={isPast}
                aria-pressed={isSelected}
                onClick={() => onSelect(dateValue)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 disabled:cursor-not-allowed disabled:opacity-30",
                  isSelected
                    ? "bg-brand-yellow-500 text-brand-black-900"
                    : "text-ink hover:bg-sunken",
                  dateValue === today &&
                    !isSelected &&
                    "ring-1 ring-brand-yellow-500",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Zatvori
          </Button>
        </div>
      </div>
    </dialog>
  );
};
