// A day range (and optionally one city / one departure) with no bookings.
export type BlockedDate = {
  id: number;
  // Inclusive "YYYY-MM-DD" days.
  startsOn: string;
  endsOn: string;
  // null = every city / every departure that day.
  city: string | null;
  time: string | null;
  // Shown to passengers.
  reason: string | null;
};
