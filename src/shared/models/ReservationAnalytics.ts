export type AnalyticsCount = { bookings: number; seats: number };

export type ReservationAnalytics = {
  range: { from: string; to: string };
  // The period of the same length that ends the day before `range` starts.
  previousRange: { from: string; to: string };
  totals: AnalyticsCount;
  previousTotals: AnalyticsCount;
  byDay: ({ date: string; city: string } & AnalyticsCount)[];
  byDeparture: ({ city: string; time: string } & AnalyticsCount)[];
  byStation: ({ location: string } & AnalyticsCount)[];
  // ISO weekday: 1 = Monday ... 7 = Sunday.
  byWeekday: ({ weekday: number } & AnalyticsCount)[];
};
