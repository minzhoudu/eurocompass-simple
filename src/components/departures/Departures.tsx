import { IoBusOutline } from "react-icons/io5";

import {
  BelgradeNow,
  BlockedDate,
  Badge,
  cn,
  DepartureSchedule,
  getTodayStatus,
  Skeleton,
  TodayStatus,
} from "../../shared";

// With `live`, today's departures are marked: the ones that have left are
// struck through, blocked ones are flagged and the next one is highlighted.
type LiveStatus = {
  schedule: DepartureSchedule;
  blockedDates: BlockedDate[];
  now: BelgradeNow;
};

type DeparturesProps = {
  isLoading: boolean;
  krusevac?: string[];
  beograd?: string[];
  beogradSunday?: string[];
  live?: LiveStatus;
};

const STATUS_LABELS: Partial<Record<TodayStatus, string>> = {
  passed: "već je prošao",
  blocked: "danas ne saobraća",
  next: "sledeći polazak",
};

const TimeChips = ({
  times,
  alignEnd,
  city,
  live,
}: {
  times: string[];
  alignEnd?: boolean;
  city: string;
  live?: LiveStatus;
}) => (
  <ul className={`flex flex-wrap gap-2 ${alignEnd ? "justify-end" : ""}`}>
    {[...times].sort().map((time, index) => {
      const status: TodayStatus = live
        ? getTodayStatus(time, { city, ...live })
        : "other";

      return (
        <li key={index}>
          <Badge
            variant={status === "next" ? "yellow" : "outline"}
            size="md"
            className={cn(
              status === "passed" && "line-through opacity-50",
              status === "blocked" &&
                "!border-red-400 !text-danger line-through",
              status === "next" && "ring-2 ring-brand-yellow-500/40",
            )}
          >
            {time}
            {STATUS_LABELS[status] && (
              <span className="sr-only"> ({STATUS_LABELS[status]})</span>
            )}
          </Badge>
        </li>
      );
    })}
  </ul>
);

export const Departures = ({
  isLoading,
  krusevac = [],
  beograd = [],
  beogradSunday = [],
  live,
}: DeparturesProps) => (
  <div className="w-full">
    <div className="flex items-center" aria-hidden="true">
      <span className="size-3 rounded-full bg-brand-yellow-500 ring-4 ring-brand-yellow-500/20" />

      <div className="relative h-0 flex-1 border-t-2 border-dashed border-line-strong">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-raised px-3">
          <IoBusOutline className="size-7 text-ink-muted" />
        </span>
      </div>

      <span className="size-3 rounded-full bg-brand-yellow-500 ring-4 ring-brand-yellow-500/20" />
    </div>

    {!isLoading ? (
      <div className="mt-4 grid grid-cols-2 gap-6 md:gap-16">
        <div className="flex flex-col items-start gap-3">
          <h3 className="font-bold text-ink">Kruševac</h3>
          <TimeChips times={krusevac} city="Kruševac" live={live} />
        </div>

        <div className="flex flex-col items-end gap-3">
          <h3 className="font-bold text-ink">Beograd</h3>
          <TimeChips times={beograd} alignEnd city="Beograd" live={live} />

          {beogradSunday.length > 0 && (
            <div className="flex w-full flex-wrap items-center justify-end gap-2 border-t border-dashed border-line-strong pt-3">
              <Badge variant="yellow" size="md">
                nedeljom
              </Badge>
              <TimeChips
                times={beogradSunday}
                alignEnd
                city="Beograd"
                live={live}
              />
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="mt-4 grid grid-cols-2 gap-6 md:gap-16">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )}

    {live && !isLoading && (
      <p className="mt-4 text-sm text-ink-muted">
        Današnji polasci: oni koji su već prošli su precrtani, a sledeći polazak
        je istaknut.
      </p>
    )}
  </div>
);
