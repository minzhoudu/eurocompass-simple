import { IoSwapHorizontalOutline } from "react-icons/io5";

type FareTicketProps = {
  label: string;
  price?: string;
};

const notchClasses =
  "absolute -top-2.5 size-5 rounded-full border border-line bg-surface";

export const FareTicket = ({ label, price }: FareTicketProps) => (
  <div className="overflow-hidden rounded-2xl border border-line bg-raised shadow-card">
    <div className="px-5 pb-5 pt-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Kruševac
        <IoSwapHorizontalOutline className="size-4 text-accent-ink" />
        Beograd
      </p>

      <p className="mt-3 text-4xl font-bold text-ink">
        {price}
        <span className="ml-1 text-base font-semibold text-accent-ink">
          ,00 RSD
        </span>
      </p>
    </div>

    <div className="relative border-t-2 border-dashed border-line-strong">
      <span className={`${notchClasses} -left-2.5`} />
      <span className={`${notchClasses} -right-2.5`} />
    </div>

    <p className="px-5 py-4 font-semibold text-accent-ink">{label}</p>
  </div>
);
