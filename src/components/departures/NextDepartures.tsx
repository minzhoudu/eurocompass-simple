import { IoArrowForward, IoTimeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import {
  addDays,
  Alert,
  BelgradeNow,
  BlockedDate,
  DepartureSchedule,
  findNextDeparture,
  getButtonClasses,
  getFormattedDate,
  NextDeparture,
  parseDateValue,
} from "../../shared";

const ROUTES = [
  { city: "Kruševac", title: "Kruševac → Beograd" },
  { city: "Beograd", title: "Beograd → Kruševac" },
];

const WEEKDAYS = ["ned", "pon", "uto", "sre", "čet", "pet", "sub"];
const UPCOMING_BLOCK_DAYS = 14;

const formatShortDate = (date: string) => getFormattedDate(date).slice(0, 6);

// "Danas" / "Sutra" / "sub, 10.10." relative to Belgrade's today.
const formatDayLabel = (date: string, now: BelgradeNow) => {
  if (date === now.date) return "Danas";
  if (date === addDays(now.date, 1)) return "Sutra";

  return `${WEEKDAYS[parseDateValue(date).getDay()]}, ${formatShortDate(date)}`;
};

const formatCountdown = (minutes: number) => {
  if (minutes < 1) return "polazi sada";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `za ${rest} min`;

  return rest === 0 ? `za ${hours} h` : `za ${hours} h ${rest} min`;
};

const formatWhen = (next: NextDeparture, now: BelgradeNow) =>
  next.minutesUntil !== null
    ? `Danas · ${formatCountdown(next.minutesUntil)}`
    : formatDayLabel(next.date, now);

const formatBlockRange = (block: BlockedDate, now: BelgradeNow) =>
  block.startsOn === block.endsOn
    ? formatDayLabel(block.startsOn, now)
    : `${formatShortDate(block.startsOn)} – ${formatShortDate(block.endsOn)}`;

// Plain wording for visitors (the admin has its own, more technical one).
const describeBlock = ({ city, time }: BlockedDate) => {
  if (time) return `${city ?? "Oba grada"}: polazak u ${time} ne saobraća`;

  return city ? `${city}: nema polazaka` : "Nema polazaka";
};

type NextDeparturesProps = {
  schedule: DepartureSchedule;
  blockedDates: BlockedDate[];
  now: BelgradeNow;
};

export const NextDepartures = ({
  schedule,
  blockedDates,
  now,
}: NextDeparturesProps) => {
  // Days without (some) departures in the coming two weeks, so a customer
  // planning a trip hears about them here, not only when booking fails.
  const lastDay = addDays(now.date, UPCOMING_BLOCK_DAYS - 1);
  const upcomingBlocks = blockedDates.filter(
    (block) => block.endsOn >= now.date && block.startsOn <= lastDay,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {ROUTES.map(({ city, title }) => {
          const next = findNextDeparture({
            city,
            schedule,
            blockedDates,
            now,
          });

          return (
            <section
              key={city}
              aria-label={`Sledeći polazak: ${title}`}
              className="flex flex-col gap-3 rounded-xl border border-line-strong bg-sunken/40 p-5"
            >
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted">
                <IoTimeOutline className="size-4" aria-hidden="true" />
                Sledeći polazak
              </p>

              <h2 className="text-lg font-bold text-ink">{title}</h2>

              {next ? (
                <>
                  <div>
                    <p className="text-4xl font-bold tracking-wide text-ink">
                      {next.time}
                    </p>
                    <p className="text-ink-muted">{formatWhen(next, now)}</p>
                  </div>

                  <Link
                    to={`/rezervacije?grad=${encodeURIComponent(city)}&datum=${next.date}&vreme=${next.time}`}
                    className={getButtonClasses({ size: "sm" })}
                  >
                    Rezerviši ovaj polazak
                    <IoArrowForward className="size-4" aria-hidden="true" />
                  </Link>
                </>
              ) : (
                <p className="text-ink-muted">
                  Trenutno nema predstojećih polazaka.
                </p>
              )}
            </section>
          );
        })}
      </div>

      {upcomingBlocks.length > 0 && (
        <Alert variant="warning" title="Dani bez polazaka">
          <ul className="flex flex-col gap-1">
            {upcomingBlocks.map((block) => (
              <li key={block.id}>
                <span className="font-semibold">
                  {formatBlockRange(block, now)}
                </span>{" "}
                - {describeBlock(block)}
                {block.reason ? ` (${block.reason})` : ""}
              </li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};
