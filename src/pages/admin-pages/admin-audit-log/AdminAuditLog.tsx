import { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoChevronDown,
  IoCloseCircle,
  IoFunnelOutline,
  IoRefreshOutline,
  IoSearchOutline,
} from "react-icons/io5";

import {
  AdminPageHeader,
  AutoRefreshControl,
  DateField,
  SelectField,
} from "../../../components";
import {
  addDays,
  Alert,
  AUDIT_ENTITY_TYPES,
  AuditLogEntry,
  AuditLogFilters,
  Badge,
  Button,
  Card,
  ChoiceButton,
  cn,
  countActiveAuditFilters,
  DEFAULT_AUDIT_LOG_FILTERS,
  getCurrentDate,
  getFormattedDate,
  LoadingBar,
  Skeleton,
  useAuditLog,
  useAutoRefresh,
  useDebouncedValue,
} from "../../../shared";
import {
  ENTITY_LABELS,
  formatEntryTime,
  formatValue,
  getActorLabel,
  getEntryDay,
  getFieldLabel,
  sortByFieldOrder,
} from "./auditLogFormat";

const WEEKDAY_NAMES = [
  "nedelja",
  "ponedeljak",
  "utorak",
  "sreda",
  "četvrtak",
  "petak",
  "subota",
];

const formatDayHeading = (day: string, today: string) => {
  if (day === today) return "Danas";
  if (day === addDays(today, -1)) return "Juče";

  const [year, month, date] = day.split("-").map(Number);
  const weekday = WEEKDAY_NAMES[new Date(year, month - 1, date).getDay()];

  return `${getFormattedDate(day)}, ${weekday}`;
};

type DayGroup = { day: string; entries: AuditLogEntry[] };

const groupByDay = (entries: AuditLogEntry[]): DayGroup[] => {
  const groups: DayGroup[] = [];

  for (const entry of entries) {
    const day = getEntryDay(entry.createdAt);
    const last = groups[groups.length - 1];

    if (last?.day === day) last.entries.push(entry);
    else groups.push({ day, entries: [entry] });
  }

  return groups;
};

const EntryDetails = ({ entry }: { entry: AuditLogEntry }) => {
  const changes = sortByFieldOrder(
    Object.entries(entry.details?.changes ?? {}),
  );
  const snapshot = sortByFieldOrder(
    Object.entries(entry.details?.snapshot ?? {}),
  );

  if (changes.length === 0 && snapshot.length === 0) return null;

  return (
    <details className="group mt-2">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded text-sm font-semibold text-accent-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 [&::-webkit-details-marker]:hidden">
        Detalji
        <IoChevronDown
          className="size-4 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <dl className="mt-2 flex flex-col gap-2 rounded-lg bg-sunken p-3 text-sm">
        {changes.map(([field, [before, after]]) => (
          <div key={field}>
            <dt className="font-semibold text-ink">{getFieldLabel(field)}</dt>
            <dd className="break-words text-ink-muted">
              <span className="line-through">{formatValue(field, before)}</span>
              <span className="mx-1.5" aria-label="promenjeno u">
                →
              </span>
              <span className="font-semibold text-ink">
                {formatValue(field, after)}
              </span>
            </dd>
          </div>
        ))}

        {snapshot.map(([field, value]) => (
          <div key={field}>
            <dt className="font-semibold text-ink">{getFieldLabel(field)}</dt>
            <dd className="break-words text-ink-muted">
              {formatValue(field, value)}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
};

const EntryRow = ({ entry }: { entry: AuditLogEntry }) => (
  <li className="flex gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4">
    <time
      dateTime={entry.createdAt}
      className="w-12 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-ink-muted"
    >
      {formatEntryTime(entry.createdAt)}
    </time>

    <div className="min-w-0 flex-1">
      <p className="break-words font-semibold text-ink">{entry.summary}</p>

      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
        <span>{getActorLabel(entry)}</span>
        <Badge variant="outline">{ENTITY_LABELS[entry.entityType]}</Badge>
        {entry.entityType === "auth" && entry.ipAddress && (
          <span title="IP adresa je okvirna: zavisi od servera preko kog je zahtev stigao">
            IP {entry.ipAddress}
          </span>
        )}
      </p>

      <EntryDetails entry={entry} />
    </div>
  </li>
);

const FiltersPanel = ({
  filters,
  actors,
  onChange,
  onReset,
  canReset,
}: {
  filters: AuditLogFilters;
  actors: { email: string; name: string | null }[];
  onChange: (filters: AuditLogFilters) => void;
  onReset: () => void;
  canReset: boolean;
}) => {
  const update = (changes: Partial<AuditLogFilters>) =>
    onChange({ ...filters, ...changes });

  const today = getCurrentDate();
  const presets = [
    { label: "Danas", from: today, to: today },
    { label: "Poslednjih 7 dana", from: addDays(today, -6), to: today },
    { label: "Poslednjih 30 dana", from: addDays(today, -29), to: today },
  ];

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink">Šta je menjano</span>

        <div className="flex flex-wrap gap-2">
          <ChoiceButton
            variant="pill"
            selected={filters.entityType === ""}
            onClick={() => update({ entityType: "" })}
          >
            Sve
          </ChoiceButton>

          {AUDIT_ENTITY_TYPES.map((type) => (
            <ChoiceButton
              key={type}
              variant="pill"
              selected={filters.entityType === type}
              onClick={() => update({ entityType: type })}
            >
              {ENTITY_LABELS[type]}
            </ChoiceButton>
          ))}
        </div>
      </div>

      <SelectField
        label="Ko je izvršio"
        value={filters.actor}
        options={[
          { value: "", label: "Svi" },
          ...actors.map((actor) => ({
            value: actor.email,
            label: actor.name?.trim()
              ? `${actor.name} (${actor.email})`
              : actor.email,
          })),
        ]}
        onChange={(actor) => update({ actor })}
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink">Period</span>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <ChoiceButton
              key={preset.label}
              variant="pill"
              selected={
                filters.from === preset.from && filters.to === preset.to
              }
              onClick={() => update({ from: preset.from, to: preset.to })}
            >
              {preset.label}
            </ChoiceButton>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          label="Od"
          value={filters.from || null}
          onChange={(date) => update({ from: date ?? "" })}
          placeholder="Od početka"
          allowPastDates
        />
        <DateField
          label="Do (uključujući)"
          value={filters.to || null}
          onChange={(date) => update({ to: date ?? "" })}
          placeholder="Do danas"
          allowPastDates
        />
      </div>

      {filters.from && filters.to && filters.to < filters.from && (
        <p role="alert" className="-mt-2 text-sm font-semibold text-danger">
          Datum &quot;do&quot; je pre datuma &quot;od&quot; - nema rezultata.
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={!canReset}
        >
          Poništi filtere
        </Button>
      </div>
    </Card>
  );
};

export const AdminAuditLog = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const [filters, setFilters] = useState<AuditLogFilters>(
    DEFAULT_AUDIT_LOG_FILTERS,
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const activeFilterCount = countActiveAuditFilters(filters);

  // A new search or filter can leave the current page past the end.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filters]);

  const {
    enabled: isAutoRefreshOn,
    setEnabled: setAutoRefresh,
    refetchInterval,
  } = useAutoRefresh();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
    dataUpdatedAt,
    refetch,
  } = useAuditLog({
    page,
    search: debouncedSearchTerm,
    filters,
    refetchInterval,
  });

  const isRefetchingList = (isPlaceholderData || isManualRefreshing) && !!data;
  const entries = data?.items ?? [];
  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;
  const groups = groupByDay(entries);
  const today = getCurrentDate();
  const isFiltered = !!debouncedSearchTerm || activeFilterCount > 0;

  const handleRefresh = async () => {
    setIsManualRefreshing(true);

    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Helmet>
        <title>Admin | Istorija izmena</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Istorija izmena"
        description="Ko je i kada menjao obaveštenja, cene, blokirane termine i rezervacije. Zapisi se čuvaju godinu dana."
      />

      {isError && (
        <Alert variant="error">
          Učitavanje istorije nije uspelo. Osvežite stranicu i pokušajte ponovo.
        </Alert>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative basis-full sm:flex-1 sm:basis-0">
          <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-ink-subtle" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Pretraga po opisu..."
            aria-label="Pretraga istorije"
            className="h-12 w-full rounded-lg border border-line-strong bg-raised pl-11 pr-10 text-ink placeholder:text-ink-subtle focus:border-brand-yellow-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow-200"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Obriši pretragu"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
            >
              <IoCloseCircle className="size-5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 sm:flex-none"
          aria-label={
            activeFilterCount > 0
              ? `Filteri (aktivno: ${activeFilterCount})`
              : "Filteri"
          }
          aria-expanded={isFilterPanelOpen}
          aria-controls="audit-log-filters"
          onClick={() => setIsFilterPanelOpen((open) => !open)}
        >
          <IoFunnelOutline className="size-5" aria-hidden="true" />
          <span className="hidden sm:inline">Filteri</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand-yellow-500 text-xs font-bold text-brand-black-900">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 sm:flex-none"
          onClick={handleRefresh}
          disabled={isManualRefreshing}
          aria-label="Osveži istoriju"
        >
          <IoRefreshOutline
            className={cn("size-5", isManualRefreshing && "animate-spin")}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Osveži</span>
        </Button>
      </div>

      {isFilterPanelOpen && (
        <div id="audit-log-filters">
          <FiltersPanel
            filters={filters}
            actors={data?.actors ?? []}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_AUDIT_LOG_FILTERS)}
            canReset={activeFilterCount > 0}
          />
        </div>
      )}

      <AutoRefreshControl
        enabled={isAutoRefreshOn}
        onToggle={setAutoRefresh}
        updatedAt={dataUpdatedAt}
        className="-mb-2"
      />

      {data && isFiltered && (
        <p className="-mb-2 text-sm text-ink-muted">
          Pronađeno: <span className="font-bold text-ink">{data.total}</span>
        </p>
      )}

      <div className="h-1">{isRefetchingList && <LoadingBar />}</div>

      <div
        aria-busy={isRefetchingList}
        className={cn(
          "flex flex-col gap-6 transition-opacity",
          isRefetchingList && "pointer-events-none opacity-50",
        )}
      >
        {isLoading && !data ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : groups.length > 0 ? (
          groups.map(({ day, entries: dayEntries }) => (
            <section key={day} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-ink">
                {formatDayHeading(day, today)}
              </h2>

              <Card>
                <ul className="divide-y divide-line">
                  {dayEntries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} />
                  ))}
                </ul>
              </Card>
            </section>
          ))
        ) : !isError ? (
          <Card className="flex flex-col items-center gap-3">
            <p className="text-center text-ink-muted">
              {isFiltered
                ? "Nema zapisa za izabranu pretragu i filtere."
                : "Još uvek nema zabeleženih izmena."}
            </p>

            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFilters(DEFAULT_AUDIT_LOG_FILTERS)}
              >
                Poništi filtere
              </Button>
            )}
          </Card>
        ) : null}
      </div>

      {data && data.total > 0 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            Prethodna
          </Button>

          <p className="text-sm text-ink-muted">
            Strana {page} od {totalPages}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={page >= totalPages}
          >
            Sledeća
          </Button>
        </div>
      )}
    </div>
  );
};
