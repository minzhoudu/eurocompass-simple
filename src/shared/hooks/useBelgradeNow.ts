import { useEffect, useState } from "react";

import { BelgradeNow, getBelgradeNow } from "../utils";

// The current Belgrade date and time, refreshed every 30 seconds and whenever
// the tab becomes visible again (timers are throttled in background tabs).
// Only re-renders when the minute actually changes.
export const useBelgradeNow = (): BelgradeNow => {
  const [now, setNow] = useState(getBelgradeNow);

  useEffect(() => {
    const update = () =>
      setNow((previous) => {
        const next = getBelgradeNow();

        return next.date === previous.date && next.minutes === previous.minutes
          ? previous
          : next;
      });

    const timer = setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return now;
};
