import { useEffect, useRef } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

import { Button } from "../ui";
import { FormData, getFormattedDate } from "./utils";

type ReservationSuccessProps = {
  data: FormData;
  onReset: () => void;
};

export const ReservationSuccess = ({
  data,
  onReset,
}: ReservationSuccessProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const rows = [
    { label: "Polazak", value: data.startingLocation },
    { label: "Datum", value: getFormattedDate(data.date) },
    { label: "Vreme", value: data.time },
    { label: "Broj mesta", value: data.numberOfTickets },
  ];

  return (
    <div role="status" className="flex flex-col items-center gap-6 py-4 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-yellow-500/20 text-accent-ink">
        <IoCheckmarkCircleOutline className="size-10" />
      </span>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-ink outline-none"
      >
        Uspešno ste rezervisali kartu!
      </h2>

      <dl className="w-full max-w-sm divide-y divide-line rounded-xl border border-line text-left text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="text-right font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <Button type="button" variant="outline" onClick={onReset}>
        Nova rezervacija
      </Button>
    </div>
  );
};
