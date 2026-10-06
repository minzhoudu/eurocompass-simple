export type ReservationSort = "newest" | "travel_asc" | "travel_desc";

export type ReservationFilters = {
  // Inclusive travel-date range ("YYYY-MM-DD"), empty = no limit.
  travelFrom: string;
  travelTo: string;
  // A city (all its stations) or one full station name; empty = any.
  location: string;
  // "HH:MM"; empty = any.
  time: string;
  duplicatesOnly: boolean;
  sort: ReservationSort;
};

export const DEFAULT_RESERVATION_FILTERS: ReservationFilters = {
  travelFrom: "",
  travelTo: "",
  location: "",
  time: "",
  duplicatesOnly: false,
  sort: "newest",
};

// How many filters differ from the defaults (the sort order counts too).
export const countActiveFilters = (filters: ReservationFilters) =>
  [
    filters.travelFrom || filters.travelTo,
    filters.location,
    filters.time,
    filters.duplicatesOnly,
    filters.sort !== DEFAULT_RESERVATION_FILTERS.sort,
  ].filter(Boolean).length;
