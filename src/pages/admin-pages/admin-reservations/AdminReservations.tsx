import { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import {
  IoCloseCircle,
  IoDownloadOutline,
  IoFunnelOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { AdminPageHeader, AutoRefreshControl } from "../../../components";
import { ReservationAnalytics } from "./ReservationAnalytics";
import { ReservationFiltersPanel } from "./ReservationFiltersPanel";
import {
  Alert,
  Badge,
  Button,
  Card,
  cn,
  ConfirmDialog,
  countActiveFilters,
  DEFAULT_RESERVATION_FILTERS,
  getCurrentDate,
  getFormattedDate,
  IconButton,
  LoadingBar,
  Reservation,
  ReservationFilters,
  ReservationPeriodStats,
  Skeleton,
  useAutoRefresh,
  useDebouncedValue,
  useDeleteReservation,
  useExportReservations,
  useReservations,
  useReservationStats,
} from "../../../shared";

const formatSubmittedAt = (iso: string) =>
  new Date(iso).toLocaleString("sr-RS", {
    timeZone: "Europe/Belgrade",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const StatTile = ({
  label,
  stats,
  isLoading,
}: {
  label: string;
  stats?: ReservationPeriodStats;
  isLoading: boolean;
}) => (
  <Card className="flex flex-col gap-1">
    <p className="text-sm font-semibold text-ink-muted">{label}</p>

    {isLoading ? (
      <Skeleton className="h-9 w-16" />
    ) : (
      <p className="text-3xl font-bold text-ink">{stats?.count ?? 0}</p>
    )}

    <p className="text-sm text-ink-muted">
      {stats?.seats ?? 0} {stats?.seats === 1 ? "mesto" : "mesta"}
    </p>
  </Card>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
      {label}
    </p>
    <p className="font-semibold text-ink">{value}</p>
  </div>
);

const ReservationRow = ({
  reservation,
  onDelete,
}: {
  reservation: Reservation;
  onDelete: () => void;
}) => (
  <div className="flex flex-col gap-4 rounded-xl border border-line-strong p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-bold text-ink">{reservation.fullName}</p>
          {reservation.isDuplicateTrip && (
            <Badge variant="outline">Ponovljena rezervacija</Badge>
          )}
        </div>
        <p className="truncate text-sm text-ink-muted">{reservation.email}</p>
      </div>

      <IconButton
        label={`Obriši rezervaciju: ${reservation.fullName}`}
        tone="danger"
        onClick={onDelete}
      >
        <IoTrashOutline className="size-[1.15rem]" />
      </IconButton>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Field label="Mesta" value={String(reservation.numberOfTickets)} />
      <Field label="Polazak" value={reservation.startingLocation} />
      <Field
        label="Datum putovanja"
        value={`${getFormattedDate(reservation.travelDate)} u ${reservation.travelTime}`}
      />
      <Field label="Poslato" value={formatSubmittedAt(reservation.createdAt)} />
    </div>

    {reservation.note && (
      <p className="text-sm italic text-ink-muted">
        Napomena: {reservation.note}
      </p>
    )}
  </div>
);

const ReservationsList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);
  const [filters, setFilters] = useState<ReservationFilters>(
    DEFAULT_RESERVATION_FILTERS,
  );
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);

  // Any new search term or filter invalidates the current page number -
  // without this, narrowing the results while sitting on page 3 could land on
  // a page that no longer exists for the new result set.
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
    data: reservationsData,
    isLoading: isLoadingReservations,
    isPlaceholderData: isShowingPreviousList,
    isError: isReservationsError,
    dataUpdatedAt,
    refetch: refetchReservations,
  } = useReservations({
    page,
    search: debouncedSearchTerm,
    filters,
    refetchInterval,
  });

  // The list dims while a new page/search (placeholderData keeps the previous
  // one on screen) or a manual refresh loads. Background auto-refreshes stay
  // invisible so the list doesn't flicker every few seconds.
  const isRefetchingList =
    (isShowingPreviousList || isManualRefreshing) && !!reservationsData;
  const {
    mutate: exportReservations,
    isPending: isExporting,
    isError: isExportError,
  } = useExportReservations();

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useReservationStats(refetchInterval);
  const { mutate: deleteReservation, isPending: isDeleting } =
    useDeleteReservation();

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const reservations = reservationsData?.items ?? [];
  const totalPages = reservationsData
    ? Math.max(1, Math.ceil(reservationsData.total / reservationsData.pageSize))
    : 1;

  const handleRefresh = async () => {
    setIsManualRefreshing(true);

    try {
      await Promise.all([refetchReservations(), refetchStats()]);
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleExport = () =>
    exportReservations({
      search: debouncedSearchTerm,
      filters,
      filename: `rezervacije-${getCurrentDate()}.csv`,
    });

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const pendingReservation = reservations.find(
    (reservation) => reservation.id === pendingDeleteId,
  );

  const confirmDelete = () => {
    if (pendingDeleteId === null) return;

    deleteReservation(pendingDeleteId, {
      onSettled: () => setPendingDeleteId(null),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {isExportError && (
        <Alert variant="error">Izvoz nije uspeo. Pokušajte ponovo.</Alert>
      )}

      {isReservationsError && (
        <Alert variant="error">
          Učitavanje rezervacija nije uspelo. Osvežite stranicu i pokušajte
          ponovo.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Danas"
          stats={stats?.today}
          isLoading={isLoadingStats}
        />
        <StatTile
          label="Ova nedelja"
          stats={stats?.week}
          isLoading={isLoadingStats}
        />
        <StatTile
          label="Ovog meseca"
          stats={stats?.month}
          isLoading={isLoadingStats}
        />
        <StatTile
          label="Ove godine"
          stats={stats?.year}
          isLoading={isLoadingStats}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!(isLoadingReservations && !reservationsData) && (
          <div className="relative basis-full sm:flex-1 sm:basis-0">
            <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-ink-subtle" />

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Pretraga po imenu ili email adresi..."
              aria-label="Pretraga rezervacija"
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
        )}

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
          aria-controls="reservation-filters"
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
          aria-label="Osveži rezervacije"
        >
          <IoRefreshOutline
            className={cn("size-5", isManualRefreshing && "animate-spin")}
          />
          <span className="hidden sm:inline">Osveži</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 sm:flex-none"
          onClick={handleExport}
          disabled={isExporting || !reservationsData?.total}
          aria-label="Izvezi u CSV sve rezervacije koje odgovaraju pretrazi i filterima"
          title="Izvezi u CSV (sve rezervacije po pretrazi i filterima)"
        >
          <IoDownloadOutline
            className={cn("size-5", isExporting && "animate-pulse")}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">
            {isExporting ? "Izvoz..." : "Izvezi"}
          </span>
        </Button>
      </div>

      {isFilterPanelOpen && (
        <div id="reservation-filters">
          <ReservationFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_RESERVATION_FILTERS)}
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

      {reservationsData && (debouncedSearchTerm || activeFilterCount > 0) && (
        <p className="-mb-2 text-sm text-ink-muted">
          Pronađeno:{" "}
          <span className="font-bold text-ink">{reservationsData.total}</span>
        </p>
      )}

      <div className="h-1">{isRefetchingList && <LoadingBar />}</div>

      <div
        aria-busy={isRefetchingList}
        className={cn(
          "flex flex-col gap-3 transition-opacity",
          isRefetchingList && "pointer-events-none opacity-50",
        )}
      >
        {isLoadingReservations && !reservationsData ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : reservations.length > 0 ? (
          reservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              onDelete={() => setPendingDeleteId(reservation.id)}
            />
          ))
        ) : activeFilterCount > 0 || debouncedSearchTerm ? (
          <Card className="flex flex-col items-center gap-3">
            <p className="text-center text-ink-muted">
              {activeFilterCount > 0
                ? "Nema rezervacija za izabrane filtere."
                : `Nema rezultata za "${debouncedSearchTerm}".`}
            </p>

            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFilters(DEFAULT_RESERVATION_FILTERS)}
              >
                Poništi filtere
              </Button>
            )}
          </Card>
        ) : (
          <Card>
            <p className="text-center text-ink-muted">
              Još uvek nema rezervacija.
            </p>
          </Card>
        )}
      </div>

      {reservationsData && reservationsData.total > 0 && (
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

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={
          pendingReservation
            ? `Obrisati rezervaciju: ${pendingReservation.fullName}?`
            : ""
        }
        description="Rezervacija će biti trajno obrisana i neće se više prikazivati u statistici."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
};

type View = "list" | "stats";

const VIEWS: { key: View; label: string }[] = [
  { key: "list", label: "Lista" },
  { key: "stats", label: "Statistika" },
];

export const AdminReservations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const view: View =
    searchParams.get("prikaz") === "statistika" ? "stats" : "list";

  const selectView = (next: View) =>
    setSearchParams(next === "stats" ? { prikaz: "statistika" } : {}, {
      replace: true,
    });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Helmet>
        <title>
          {view === "stats" ? "Admin | Statistika" : "Admin | Rezervacije"}
        </title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Rezervacije"
        description={
          view === "stats"
            ? "Pregled rezervacija po datumu putovanja."
            : "Rezervacije poslate preko sajta u poslednjih godinu dana."
        }
      />

      <div
        role="group"
        aria-label="Prikaz"
        className="inline-flex self-start rounded-lg bg-sunken p-1"
      >
        {VIEWS.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={view === item.key}
            onClick={() => selectView(item.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500",
              view === item.key
                ? "bg-raised text-ink shadow-card"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "stats" ? <ReservationAnalytics /> : <ReservationsList />}
    </div>
  );
};
