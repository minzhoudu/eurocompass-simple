import { useMemo, useState } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";

import {
  BarList,
  BarListItem,
  ChartCard,
  ColumnChart,
  ColumnDatum,
  ColumnSeries,
  DateField,
} from "../../../components";
import {
  addDays,
  Alert,
  Card,
  ChoiceButton,
  CITY_NAMES,
  getCityName,
  getCurrentDate,
  getFormattedDate,
  getStationName,
  parseDateValue,
  pluralize,
  ReservationAnalytics as Analytics,
  Skeleton,
  toDateValue,
  useReservationAnalytics,
} from "../../../shared";

type PeriodKey = "last30" | "next30" | "month" | "year" | "custom";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "last30", label: "Poslednjih 30 dana" },
  { key: "next30", label: "Narednih 30 dana" },
  { key: "month", label: "Ovaj mesec" },
  { key: "year", label: "Ova godina" },
  { key: "custom", label: "Prilagođeno" },
];

const MAX_CUSTOM_DAYS = 366;
// Beyond this many days the daily columns get too thin; group by week.
const WEEKLY_AFTER_DAYS = 45;

const CITY_COLORS: Record<string, string> = {
  Kruševac: "var(--viz-krusevac)",
  Beograd: "var(--viz-beograd)",
};
const getCityColor = (city: string) => CITY_COLORS[city] ?? "var(--viz-dim)";

const WEEKDAYS_SHORT = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const WEEKDAYS_LONG = [
  "Ponedeljak",
  "Utorak",
  "Sreda",
  "Četvrtak",
  "Petak",
  "Subota",
  "Nedelja",
];

const getPresetRange = (key: PeriodKey, today: string) => {
  switch (key) {
    case "next30":
      return { from: today, to: addDays(today, 29) };
    case "month": {
      const first = `${today.slice(0, 8)}01`;
      const lastDate = parseDateValue(first);
      lastDate.setMonth(lastDate.getMonth() + 1, 0);

      return { from: first, to: toDateValue(lastDate) };
    }
    case "year":
      return {
        from: `${today.slice(0, 4)}-01-01`,
        to: `${today.slice(0, 4)}-12-31`,
      };
    default:
      return { from: addDays(today, -29), to: today };
  }
};

const formatShortDate = (date: string) => {
  const [, month, day] = date.split("-");

  return `${day}.${month}.`;
};

// "Sub, 10.10.2026"
const formatDayTitle = (date: string) => {
  const weekday = (parseDateValue(date).getDay() + 6) % 7;

  return `${WEEKDAYS_SHORT[weekday]}, ${getFormattedDate(date)}`;
};

const getMondayOf = (date: string) => {
  const weekday = (parseDateValue(date).getDay() + 6) % 7;

  return addDays(date, -weekday);
};

const formatSeats = (seats: number) =>
  `${seats} ${pluralize(seats, "mesto", "mesta", "mesta")}`;

const formatBookings = (count: number) =>
  `${count} ${pluralize(count, "rezervacija", "rezervacije", "rezervacija")}`;

type KpiTileProps = {
  label: string;
  value: string;
  // Percent vs the previous period; null = nothing to compare against.
  delta?: number | null;
  detail?: string;
};

const KpiTile = ({ label, value, delta, detail }: KpiTileProps) => (
  <Card className="flex flex-col gap-1">
    <p className="text-sm font-semibold text-ink-muted">{label}</p>
    <p className="text-3xl font-bold text-ink">{value}</p>

    {delta !== undefined && delta !== null && delta !== 0 && (
      <div className="flex flex-col">
        <p
          className={
            delta > 0
              ? "flex items-center gap-1 text-sm font-semibold text-[#006300] dark:text-[#22c55e]"
              : "flex items-center gap-1 text-sm font-semibold text-ink-muted"
          }
        >
          {delta > 0 ? (
            <IoArrowUp aria-hidden="true" className="size-4" />
          ) : (
            <IoArrowDown aria-hidden="true" className="size-4" />
          )}
          {delta > 0 ? "+" : ""}
          {delta}%
        </p>
        <p className="text-sm text-ink-muted">u odnosu na prethodni period</p>
      </div>
    )}
    {delta === 0 && (
      <p className="text-sm text-ink-muted">Isto kao prethodni period</p>
    )}
    {detail && <p className="text-sm text-ink-muted">{detail}</p>}
  </Card>
);

const getDelta = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;

// Turns the API rows into chart-ready data.
const buildCharts = (analytics: Analytics) => {
  const { from, to } = analytics.range;

  const cities = [
    ...new Set([
      ...CITY_NAMES,
      ...analytics.byDay.map((row) => row.city),
      ...analytics.byDeparture.map((row) => row.city),
    ]),
  ].filter(
    (city) =>
      CITY_NAMES.includes(city) ||
      analytics.byDay.some((row) => row.city === city),
  );

  const series: ColumnSeries[] = cities.map((city) => ({
    key: city,
    label: city,
    color: getCityColor(city),
  }));

  // seats per date per city, with the empty days filled in
  const perDay = new Map<string, Record<string, number>>();
  for (let day = from; day <= to; day = addDays(day, 1)) perDay.set(day, {});
  analytics.byDay.forEach((row) => {
    const entry = perDay.get(row.date);

    if (entry) entry[row.city] = (entry[row.city] ?? 0) + row.seats;
  });

  const dayCount = perDay.size;
  const isWeekly = dayCount > WEEKLY_AFTER_DAYS;

  const buckets = new Map<
    string,
    { title: string; values: Record<string, number> }
  >();
  perDay.forEach((values, day) => {
    const key = isWeekly ? getMondayOf(day) : day;
    const bucket = buckets.get(key) ?? {
      title: isWeekly
        ? `Nedelja od ${formatShortDate(key)} ${key.slice(0, 4)}.`
        : formatDayTitle(day),
      values: {},
    };

    Object.entries(values).forEach(([city, seats]) => {
      bucket.values[city] = (bucket.values[city] ?? 0) + seats;
    });
    buckets.set(key, bucket);
  });

  const dayData: ColumnDatum[] = [...buckets.entries()].map(
    ([key, bucket]) => ({
      key,
      label: formatShortDate(key),
      title: bucket.title,
      values: bucket.values,
    }),
  );

  const departures: BarListItem[] = [...analytics.byDeparture]
    .sort((a, b) => b.seats - a.seats || a.time.localeCompare(b.time))
    .slice(0, 8)
    .map((row) => ({
      key: `${row.city}-${row.time}`,
      label: `${row.city} ${row.time}`,
      value: row.seats,
      color: getCityColor(row.city),
      detail: formatBookings(row.bookings),
    }));

  const stations: BarListItem[] = [...analytics.byStation]
    .sort((a, b) => b.seats - a.seats)
    .map((row) => {
      const city = getCityName(row.location);

      return {
        key: row.location,
        label: `${city}: ${getStationName(row.location) || row.location}`,
        value: row.seats,
        color: getCityColor(city),
        detail: formatBookings(row.bookings),
      };
    });

  const weekdayData: ColumnDatum[] = WEEKDAYS_SHORT.map((label, index) => {
    const row = analytics.byWeekday.find((item) => item.weekday === index + 1);

    return {
      key: String(index + 1),
      label,
      title: WEEKDAYS_LONG[index],
      values: { total: row?.seats ?? 0 },
    };
  });

  // The single busiest day (not week bucket) for the KPI tile.
  const dayTotals = new Map<string, number>();
  analytics.byDay.forEach((row) =>
    dayTotals.set(row.date, (dayTotals.get(row.date) ?? 0) + row.seats),
  );
  const busiest = [...dayTotals.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  )[0];

  return {
    series,
    dayData,
    isWeekly,
    departures,
    stations,
    weekdayData,
    busiest,
  };
};

export const ReservationAnalytics = () => {
  const today = getCurrentDate();
  const [period, setPeriod] = useState<PeriodKey>("last30");
  const [customFrom, setCustomFrom] = useState<string | null>(
    addDays(today, -29),
  );
  const [customTo, setCustomTo] = useState<string | null>(today);

  const range =
    period === "custom"
      ? { from: customFrom ?? "", to: customTo ?? "" }
      : getPresetRange(period, today);

  const customError =
    period !== "custom"
      ? undefined
      : !range.from || !range.to
        ? "Izaberite početni i krajnji datum."
        : range.to < range.from
          ? "Krajnji datum ne može biti pre početnog."
          : (parseDateValue(range.to).getTime() -
                parseDateValue(range.from).getTime()) /
                86_400_000 +
                1 >
              MAX_CUSTOM_DAYS
            ? `Period može imati najviše ${MAX_CUSTOM_DAYS} dana.`
            : undefined;

  const { data, isLoading, isError, isPlaceholderData } =
    useReservationAnalytics(
      customError ? "" : range.from,
      customError ? "" : range.to,
    );

  const charts = useMemo(() => (data ? buildCharts(data) : null), [data]);

  const weekdaySeries: ColumnSeries[] = [
    { key: "total", label: "Putnici", color: "var(--viz-total)" },
  ];

  return (
    <div className="viz-root flex flex-col gap-6">
      {/* One filter row above everything it scopes. */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((item) => (
            <ChoiceButton
              key={item.key}
              variant="pill"
              selected={period === item.key}
              onClick={() => setPeriod(item.key)}
            >
              {item.label}
            </ChoiceButton>
          ))}
        </div>

        {period === "custom" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField
              label="Od datuma"
              value={customFrom}
              onChange={setCustomFrom}
              placeholder="Izaberite datum"
              allowPastDates
            />
            <DateField
              label="Do datuma (uključujući)"
              value={customTo}
              onChange={setCustomTo}
              placeholder="Izaberite datum"
              allowPastDates
            />
          </div>
        )}

        <p className="text-sm text-ink-muted">
          {customError ??
            `Putovanja od ${getFormattedDate(range.from)} do ${getFormattedDate(range.to)} (po datumu putovanja).`}
        </p>
      </div>

      {isError && (
        <Alert variant="error">
          Učitavanje statistike nije uspelo. Osvežite stranicu i pokušajte
          ponovo.
        </Alert>
      )}

      {isLoading || !data || !charts ? (
        !isError && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-28" />
              ))}
            </div>
            <Skeleton className="h-72" />
          </>
        )
      ) : (
        <div
          aria-busy={isPlaceholderData}
          className={
            isPlaceholderData
              ? "flex flex-col gap-6 opacity-50 transition-opacity"
              : "flex flex-col gap-6 transition-opacity"
          }
        >
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiTile
              label="Putnici (mesta)"
              value={String(data.totals.seats)}
              delta={getDelta(data.totals.seats, data.previousTotals.seats)}
            />
            <KpiTile
              label="Rezervacije"
              value={String(data.totals.bookings)}
              delta={getDelta(
                data.totals.bookings,
                data.previousTotals.bookings,
              )}
            />
            <KpiTile
              label="Mesta po rezervaciji"
              value={
                data.totals.bookings > 0
                  ? (data.totals.seats / data.totals.bookings)
                      .toFixed(1)
                      .replace(".", ",")
                  : "-"
              }
              detail="u proseku"
            />
            <KpiTile
              label="Najprometniji dan"
              value={charts.busiest ? formatShortDate(charts.busiest[0]) : "-"}
              detail={
                charts.busiest
                  ? `${formatDayTitle(charts.busiest[0]).split(",")[0]}, ${formatSeats(charts.busiest[1])}`
                  : undefined
              }
            />
          </div>

          {data.totals.bookings === 0 ? (
            <Card>
              <p className="text-center text-ink-muted">
                Nema rezervacija u izabranom periodu.
              </p>
            </Card>
          ) : (
            <>
              <ChartCard
                title={
                  charts.isWeekly ? "Putnici po nedelji" : "Putnici po danu"
                }
                subtitle="Broj mesta po datumu putovanja, po gradu polaska."
                isRefetching={isPlaceholderData}
                table={{
                  columns: [
                    charts.isWeekly ? "Nedelja" : "Datum",
                    ...charts.series.map((item) => item.label),
                    "Ukupno",
                  ],
                  rows: charts.dayData.map((datum) => [
                    datum.title,
                    ...charts.series.map((item) => datum.values[item.key] ?? 0),
                    charts.series.reduce(
                      (sum, item) => sum + (datum.values[item.key] ?? 0),
                      0,
                    ),
                  ]),
                }}
              >
                <ColumnChart
                  data={charts.dayData}
                  series={charts.series}
                  unit="mesta"
                  valueLabels="peak"
                  ariaLabel={
                    charts.isWeekly
                      ? "Broj putnika po nedelji"
                      : "Broj putnika po danu"
                  }
                />
              </ChartCard>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Najprometniji polasci"
                  subtitle="Ukupan broj mesta po polasku (do 8 najpopularnijih)."
                  isRefetching={isPlaceholderData}
                  table={{
                    columns: ["Polazak", "Mesta", "Rezervacija"],
                    rows: [...data.byDeparture]
                      .sort((a, b) => b.seats - a.seats)
                      .map((row) => [
                        `${row.city} ${row.time}`,
                        row.seats,
                        row.bookings,
                      ]),
                  }}
                >
                  <BarList
                    items={charts.departures}
                    unit="mesta"
                    ariaLabel="Mesta po polasku"
                    legend={charts.series}
                  />
                </ChartCard>

                <ChartCard
                  title="Po danu u nedelji"
                  subtitle="Najprometniji dan u nedelji je istaknut."
                  isRefetching={isPlaceholderData}
                  table={{
                    columns: ["Dan", "Mesta", "Rezervacija"],
                    rows: WEEKDAYS_LONG.map((name, index) => [
                      name,
                      data.byWeekday.find((row) => row.weekday === index + 1)
                        ?.seats ?? 0,
                      data.byWeekday.find((row) => row.weekday === index + 1)
                        ?.bookings ?? 0,
                    ]),
                  }}
                >
                  <ColumnChart
                    data={charts.weekdayData}
                    series={weekdaySeries}
                    unit="mesta"
                    emphasizePeak
                    valueLabels="all"
                    height={180}
                    ariaLabel="Mesta po danu u nedelji"
                  />
                </ChartCard>
              </div>

              <ChartCard
                title="Po stanicama"
                subtitle="Sa kojih stanica putnici najčešće polaze."
                isRefetching={isPlaceholderData}
                table={{
                  columns: ["Stanica", "Mesta", "Rezervacija"],
                  rows: charts.stations.map((item) => [
                    item.label,
                    item.value,
                    item.detail?.split(" ")[0] ?? 0,
                  ]),
                }}
              >
                <BarList
                  items={charts.stations}
                  unit="mesta"
                  labelWidth="13rem"
                  ariaLabel="Mesta po stanici"
                  legend={charts.series}
                />
              </ChartCard>
            </>
          )}
        </div>
      )}
    </div>
  );
};
