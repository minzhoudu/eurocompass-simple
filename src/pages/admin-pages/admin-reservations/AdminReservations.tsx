import { ChangeEvent, useMemo, useState } from "react";
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
  Card,
  ConfirmDialog,
  getFormattedDate,
  IconButton,
  Reservation,
  ReservationPeriodStats,
  Skeleton,
  useDeleteReservation,
  useReservations,
  useReservationStats,
} from "../../../shared";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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
  isReturning,
  onDelete,
}: {
  reservation: Reservation;
  isReturning: boolean;
  onDelete: () => void;
}) => (
  <div className="flex flex-col gap-4 rounded-xl border border-line-strong p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-bold text-ink">
            {reservation.fullName}
          </p>
          {isReturning && (
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
  const {
    data: reservations,
    isLoading: isLoadingReservations,
    isError: isReservationsError,
  } = useReservations();
  const { data: stats, isLoading: isLoadingStats } = useReservationStats();
  const { mutate: deleteReservation, isPending: isDeleting } =
    useDeleteReservation();

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const emailCounts = useMemo(() => {
    const counts = new Map<string, number>();

    reservations?.forEach((reservation) => {
      const key = normalizeEmail(reservation.email);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return counts;
  }, [reservations]);

  // "Returning" badges stay based on the full list above, not the filtered
  // one - it's a fact about the customer, not about the current search.
  const filteredReservations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return reservations ?? [];

    return (reservations ?? []).filter(
      (reservation) =>
        reservation.fullName.toLowerCase().includes(query) ||
        normalizeEmail(reservation.email).includes(query),
    );
  }, [reservations, searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const pendingReservation = reservations?.find(
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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Danas" stats={stats?.today} isLoading={isLoadingStats} />
        <StatTile
          label="Ovog meseca"
          stats={stats?.month}
          isLoading={isLoadingStats}
        />
        <StatTile label="Ove godine" stats={stats?.year} isLoading={isLoadingStats} />
      </div>

      {!isLoadingReservations && reservations && reservations.length > 0 && (
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

      <div className="flex flex-col gap-3">
        {isLoadingReservations ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : reservations && reservations.length > 0 ? (
          filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
                isReturning={
                  (emailCounts.get(normalizeEmail(reservation.email)) ?? 0) >
                  1
                }
                onDelete={() => setPendingDeleteId(reservation.id)}
              />
            ))
          ) : (
            <Card>
              <p className="text-center text-ink-muted">
                Nema rezultata za &quot;{searchTerm}&quot;.
              </p>
            </Card>
          )
        ) : (
          <Card>
            <p className="text-center text-ink-muted">
              Još uvek nema rezervacija.
            </p>
          </Card>
        )}
      </div>

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
