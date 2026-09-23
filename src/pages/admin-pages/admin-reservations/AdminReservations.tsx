import { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoCloseCircle,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";

import { AdminPageHeader } from "../../../components";
import {
  Alert,
  Badge,
  Button,
  Card,
  cn,
  ConfirmDialog,
  getFormattedDate,
  IconButton,
  LoadingBar,
  Reservation,
  ReservationPeriodStats,
  Skeleton,
  useDebouncedValue,
  useDeleteReservation,
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
          <p className="truncate font-bold text-ink">
            {reservation.fullName}
          </p>
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
      <Field
        label="Poslato"
        value={formatSubmittedAt(reservation.createdAt)}
      />
    </div>

    {reservation.note && (
      <p className="text-sm italic text-ink-muted">
        Napomena: {reservation.note}
      </p>
    )}
  </div>
);

export const AdminReservations = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 400);

  // Any new search term invalidates the current page number - without this,
  // typing a narrower search while sitting on page 3 could land on a page
  // that no longer exists for the new result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const {
    data: reservationsData,
    isLoading: isLoadingReservations,
    isFetching: isFetchingReservations,
    isError: isReservationsError,
  } = useReservations({ page, search: debouncedSearchTerm });

  // With placeholderData keeping the previous page on screen, isFetching
  // (not isLoading) is what actually fires while a new page/search request
  // is in flight - isLoading only ever covers the very first load.
  const isRefetchingList = isFetchingReservations && !!reservationsData;
  const { data: stats, isLoading: isLoadingStats } = useReservationStats();
  const { mutate: deleteReservation, isPending: isDeleting } =
    useDeleteReservation();

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const reservations = reservationsData?.items ?? [];
  const totalPages = reservationsData
    ? Math.max(1, Math.ceil(reservationsData.total / reservationsData.pageSize))
    : 1;

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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Helmet>
        <title>Admin | Rezervacije</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Rezervacije"
        description="Rezervacije poslate preko sajta u poslednjih godinu dana."
      />

      {isReservationsError && (
        <Alert variant="error">
          Učitavanje rezervacija nije uspelo. Osvežite stranicu i pokušajte
          ponovo.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Danas" stats={stats?.today} isLoading={isLoadingStats} />
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
        <StatTile label="Ove godine" stats={stats?.year} isLoading={isLoadingStats} />
      </div>

      {!(isLoadingReservations && !reservationsData) && (
        <div className="relative">
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
        ) : debouncedSearchTerm ? (
          <Card>
            <p className="text-center text-ink-muted">
              Nema rezultata za &quot;{debouncedSearchTerm}&quot;.
            </p>
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
