import { useState } from "react";
import { IoCalendarOutline, IoClose } from "react-icons/io5";

import {
  Button,
  CalendarDialog,
  getFormattedDate,
  IconButton,
} from "../../../shared";

type DateFieldProps = {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  // The booking-style calendar blocks past days; filters and reports need them.
  allowPastDates?: boolean;
};

// An optional date: a button that opens the calendar, with a clear (x) button.
export const DateField = ({
  label,
  value,
  onChange,
  placeholder = "Bez ograničenja",
  allowPastDates = false,
}: DateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-ink">{label}</span>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 justify-start"
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
        >
          <IoCalendarOutline className="size-5 shrink-0" aria-hidden="true" />
          {value ? getFormattedDate(value) : placeholder}
        </Button>

        {value && (
          <IconButton label="Ukloni datum" onClick={() => onChange(null)}>
            <IoClose className="size-5" />
          </IconButton>
        )}
      </div>

      <CalendarDialog
        open={isOpen}
        value={value ?? ""}
        allowPastDates={allowPastDates}
        onSelect={(date) => {
          onChange(date);
          setIsOpen(false);
        }}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};
