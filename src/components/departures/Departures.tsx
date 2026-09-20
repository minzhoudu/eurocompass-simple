import { IoBusOutline } from "react-icons/io5";

import { Badge, Skeleton } from "../../shared";

type DeparturesProps = {
  isLoading: boolean;
  krusevac?: string[];
  beograd?: string[];
  beogradSunday?: string[];
};

const TimeChips = ({
  times,
  alignEnd,
}: {
  times: string[];
  alignEnd?: boolean;
}) => (
  <ul className={`flex flex-wrap gap-2 ${alignEnd ? "justify-end" : ""}`}>
    {[...times].sort().map((time, index) => (
      <li key={index}>
        <Badge variant="outline" size="md">
          {time}
        </Badge>
      </li>
    ))}
  </ul>
);

export const Departures = ({
  isLoading,
  krusevac = [],
  beograd = [],
  beogradSunday = [],
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
          <TimeChips times={krusevac} />
        </div>

        <div className="flex flex-col items-end gap-3">
          <h3 className="font-bold text-ink">Beograd</h3>
          <TimeChips times={beograd} alignEnd />

          {beogradSunday.length > 0 && (
            <div className="flex w-full flex-wrap items-center justify-end gap-2 border-t border-dashed border-line-strong pt-3">
              <Badge variant="yellow" size="md">
                nedeljom
              </Badge>
              <TimeChips times={beogradSunday} alignEnd />
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
  </div>
);
