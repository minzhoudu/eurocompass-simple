import { addDays, getBelgradeNow, getFormattedDate } from "../../../shared";

const ACTIVE_NOW_MINUTES = 5;

export type LastActive = {
  text: string;
  // Used within the last few minutes: shown with a green dot.
  isActiveNow: boolean;
};

// "upravo sada", "pre 12 min", "danas u 14:05", "juče u 09:30",
// "03.10.2026. u 17:45" - day and time in Belgrade time.
export const formatLastActive = (
  iso: string | null,
  now: Date = new Date(),
): LastActive => {
  if (!iso) return { text: "još nema podataka", isActiveNow: false };

  const then = new Date(iso);
  const minutesAgo = Math.floor((now.getTime() - then.getTime()) / 60_000);

  if (minutesAgo < 2) return { text: "upravo sada", isActiveNow: true };

  if (minutesAgo < 60) {
    return {
      text: `pre ${minutesAgo} min`,
      isActiveNow: minutesAgo < ACTIVE_NOW_MINUTES,
    };
  }

  const today = getBelgradeNow(now).date;
  const { date, time } = getBelgradeNow(then);

  if (date === today) return { text: `danas u ${time}`, isActiveNow: false };
  if (date === addDays(today, -1)) {
    return { text: `juče u ${time}`, isActiveNow: false };
  }

  return { text: `${getFormattedDate(date)}. u ${time}`, isActiveNow: false };
};
