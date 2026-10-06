import { BlockedDate } from "../../../models";
import { BelgradeNow } from "../../../utils/belgradeTime";
import { addDays } from "../../../utils/dates";
import { findDepartureBlock } from "./blockedDates";
import { DepartureSchedule, getTravelTimes } from "./formsHelpers";

const HORIZON_DAYS = 14;

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

export type NextDeparture = {
  // "YYYY-MM-DD"
  date: string;
  time: string;
  // 0 = today, 1 = tomorrow ...
  dayOffset: number;
  // Only for today's departures.
  minutesUntil: number | null;
};

type DepartureQuery = {
  city: string;
  schedule: DepartureSchedule;
  blockedDates: BlockedDate[];
  now: BelgradeNow;
};

// The first departure from `city` that has not left yet and is not blocked,
// looking up to two weeks ahead (so a blocked stretch is skipped over).
export const findNextDeparture = ({
  city,
  schedule,
  blockedDates,
  now,
}: DepartureQuery): NextDeparture | null => {
  for (let dayOffset = 0; dayOffset < HORIZON_DAYS; dayOffset++) {
    const date = addDays(now.date, dayOffset);

    for (const time of getTravelTimes(city, date, schedule)) {
      const isToday = dayOffset === 0;

      if (isToday && timeToMinutes(time) <= now.minutes) continue;
      if (findDepartureBlock(blockedDates, date, city, time)) continue;

      return {
        date,
        time,
        dayOffset,
        minutesUntil: isToday ? timeToMinutes(time) - now.minutes : null,
      };
    }
  }

  return null;
};

export type TodayStatus = "passed" | "blocked" | "next" | "upcoming" | "other";

// How one time chip should look today. "other" = not a departure today (e.g.
// the Sunday-only times on a weekday): shown neutrally.
export const getTodayStatus = (
  time: string,
  { city, schedule, blockedDates, now }: DepartureQuery,
): TodayStatus => {
  if (!getTravelTimes(city, now.date, schedule).includes(time)) return "other";
  if (timeToMinutes(time) <= now.minutes) return "passed";
  if (findDepartureBlock(blockedDates, now.date, city, time)) return "blocked";

  const next = findNextDeparture({ city, schedule, blockedDates, now });

  return next?.dayOffset === 0 && next.time === time ? "next" : "upcoming";
};
