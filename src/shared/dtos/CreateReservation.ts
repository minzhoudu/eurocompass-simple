export type CreateReservationDto = {
  fullName: string;
  email: string;
  phone: string;
  startingLocation: string;
  travelDate: string;
  travelTime: string;
  numberOfTickets: number;
  note?: string;
  // Bot checks (see ReservationForm): the hidden trap field and how long the
  // form was open.
  hp?: string;
  elapsedMs?: number;
};
