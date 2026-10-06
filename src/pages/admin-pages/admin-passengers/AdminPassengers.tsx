import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  IoCalendarOutline,
  IoCallOutline,
  IoChevronBack,
  IoChevronForward,
  IoPrintOutline,
} from "react-icons/io5";
import { useSearchParams } from "react-router-dom";

import { AdminPageHeader } from "../../../components";
import {
  Alert,
  Button,
  CalendarDialog,
  Card,
  CITY_NAMES,
  DepartureReservation,
  getCityName,
  getCurrentDate,
  getFormattedDate,
  getStationName,
  getTravelTimes,
  IconButton,
  parseDateValue,
  Skeleton,
  toDateValue,
  useDepartureSchedule,
  useReservationsByDate,
} from "../../../shared";

const WEEKDAY_NAMES = [
  "Nedelja",
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
];

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DIRECTION_TITLES: Record<string, string> = {
  Kruševac: "Kruševac → Beograd",
  Beograd: "Beograd → Kruševac",
};

// Serbian plural: 1 / 21 -> one, 2-4 / 22-24 -> few, everything else -> many.
const pluralize = (count: number, one: string, few: string, many: string) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return one;
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  )
    return few;

  return many;
};

const formatSeats = (seats: number) =>
  `${seats} ${pluralize(seats, "mesto", "mesta", "mesta")}`;

const formatReservations = (count: number) =>
  `${count} ${pluralize(count, "rezervacija", "rezervacije", "rezervacija")}`;

const shiftDate = (date: string, days: number) => {
  const shifted = parseDateValue(date);
  shifted.setDate(shifted.getDate() + days);

  return toDateValue(shifted);
};

const formatDayLabel = (date: string) =>
  `${WEEKDAY_NAMES[parseDateValue(date).getDay()]}, ${getFormattedDate(date)}`;

const sumSeats = (reservations: DepartureReservation[]) =>
  reservations.reduce((total, item) => total + item.numberOfTickets, 0);

type Departure = {
  time: string;
  reservations: DepartureReservation[];
};

type Direction = {
  city: string;
  departures: Departure[];
};

const PassengerRow = ({
  reservation,
}: {
  reservation: DepartureReservation;
}) => (
  <li className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
    <div className="min-w-0">
      <p className="font-semibold text-ink">{reservation.fullName}</p>

      <p className="text-sm text-ink-muted">
        {getStationName(reservation.startingLocation) ||
          reservation.startingLocation}
      </p>

      {reservation.note && (
        <p className="mt-1 text-sm italic text-ink-muted">
          Napomena: {reservation.note}
        </p>
      )}
    </div>

    <div className="flex shrink-0 flex-col gap-1 sm:items-end">
      <p className="font-bold text-ink">
        {formatSeats(reservation.numberOfTickets)}
      </p>

      <a
        href={`tel:${reservation.phone.replace(/[^\d+]/g, "")}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-ink hover:underline"
      >
        <IoCallOutline className="size-4" aria-hidden="true" />
        {reservation.phone}
      </a>
    </div>
  </li>
);

const DepartureCard = ({ departure }: { departure: Departure }) => {
  const { time, reservations } = departure;
  const seats = sumSeats(reservations);

  return (
    <Card className="flex break-inside-avoid flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-2xl font-bold text-ink">{time}</h3>

        {reservations.length > 0 ? (
          <p className="text-right">
            <span className="block font-bold text-ink">
              {formatSeats(seats)}
            </span>
            <span className="block text-sm text-ink-muted">
              {formatReservations(reservations.length)}
            </span>
          </p>
        ) : (
          <p className="text-sm text-ink-muted">Nema rezervacija</p>
        )}
      </div>

      {reservations.length > 0 && (
        <ul className="divide-y divide-line border-t border-line pt-4">
          {reservations.map((reservation) => (
            <PassengerRow key={reservation.id} reservation={reservation} />
          ))}
        </ul>
      )}
    </Card>
  );
};

export const AdminPassengers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const today = getCurrentDate();
  const dateParam = searchParams.get("datum");
  const date =
    dateParam && DATE_PARAM_PATTERN.test(dateParam) ? dateParam : today;

  const { schedule } = useDepartureSchedule({ staleTime: 0 });
  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useReservationsByDate(date);

  const selectDate = (nextDate: string) =>
    setSearchParams(nextDate === today ? {} : { datum: nextDate }, {
      replace: true,
    });

  // Every scheduled departure for the day is listed (even empty ones), plus
  // any booked time that is no longer in the schedule so no passenger is lost.
  const cities = [
    ...new Set([
      ...CITY_NAMES,
      ...reservations.map((r) => getCityName(r.startingLocation)),
    ]),
  ];

  const directions: Direction[] = cities.map((city) => {
    const cityReservations = reservations.filter(
      (reservation) => getCityName(reservation.startingLocation) === city,
    );
    const times = [
      ...new Set([
        ...getTravelTimes(city, date, schedule),
        ...cityReservations.map((reservation) => reservation.travelTime),
      ]),
    ].sort();

    return {
      city,
      departures: times.map((time) => ({
        time,
        reservations: cityReservations.filter(
          (reservation) => reservation.travelTime === time,
        ),
      })),
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Helmet>
        <title>Admin | Putnici</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <AdminPageHeader
        title="Putnici po polasku"
        description="Ko putuje kojim polaskom na izabrani dan."
      />

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <IconButton
          label="Prethodni dan"
          onClick={() => selectDate(shiftDate(date, -1))}
          className="border border-line-strong"
        >
          <IoChevronBack className="size-5" />
        </IconButton>

        <Button
          type="button"
          variant="outline"
          className="min-w-52"
          aria-haspopup="dialog"
          onClick={() => setIsCalendarOpen(true)}
        >
          <IoCalendarOutline className="size-5" aria-hidden="true" />
          {formatDayLabel(date)}
        </Button>

        <IconButton
          label="Sledeći dan"
          onClick={() => selectDate(shiftDate(date, 1))}
          className="border border-line-strong"
        >
          <IoChevronForward className="size-5" />
        </IconButton>

        {date !== today && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => selectDate(today)}
          >
            Danas
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => window.print()}
        >
          <IoPrintOutline className="size-4" aria-hidden="true" />
          Štampaj
        </Button>
      </div>

      <p className="hidden text-lg font-bold text-ink print:block">
        {formatDayLabel(date)}
      </p>

      {isError && (
        <Alert variant="error">
          Učitavanje putnika nije uspelo. Osvežite stranicu i pokušajte ponovo.
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <>
          <p className="text-ink-muted">
            Ukupno za dan:{" "}
            <span className="font-bold text-ink">
              {formatSeats(sumSeats(reservations))}
            </span>{" "}
            · {formatReservations(reservations.length)}
          </p>

          <div className="grid items-start gap-8 lg:grid-cols-2 print:grid-cols-1">
            {directions.map(({ city, departures }) => (
              <section key={city} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-ink">
                  {DIRECTION_TITLES[city] ?? city}
                </h2>

                {departures.length > 0 ? (
                  departures.map((departure) => (
                    <DepartureCard key={departure.time} departure={departure} />
                  ))
                ) : (
                  <Card>
                    <p className="text-center text-ink-muted">
                      Nema polazaka za ovaj dan.
                    </p>
                  </Card>
                )}
              </section>
            ))}
          </div>
        </>
      )}

      <CalendarDialog
        open={isCalendarOpen}
        value={date}
        allowPastDates
        onSelect={(selected) => {
          selectDate(selected);
          setIsCalendarOpen(false);
        }}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
};
