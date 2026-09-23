export type Reservation = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  startingLocation: string;
  travelDate: string;
  travelTime: string;
  numberOfTickets: number;
  note: string | null;
  createdAt: string;
  isDuplicateTrip: boolean;
};

export type PaginatedReservations = {
  items: Reservation[];
  total: number;
  page: number;
  pageSize: number;
};

export type ReservationPeriodStats = {
  count: number;
  seats: number;
};

export type ReservationStats = {
  today: ReservationPeriodStats;
  week: ReservationPeriodStats;
  month: ReservationPeriodStats;
  year: ReservationPeriodStats;
};
