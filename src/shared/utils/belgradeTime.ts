const TIMEZONE = "Europe/Belgrade";

export type BelgradeNow = {
  // "YYYY-MM-DD"
  date: string;
  // "HH:MM"
  time: string;
  minutes: number;
};

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// The current date and time in Belgrade, whatever the visitor's own clock or
// time zone says - departures run on Belgrade time.
export const getBelgradeNow = (now: Date = new Date()): BelgradeNow => {
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};
