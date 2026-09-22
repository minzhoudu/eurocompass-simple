export type CreateReservationDto = {
  fullName: string;
  email: string;
  phone: string;
  startingLocation: string;
  travelDate: string;
  travelTime: string;
  numberOfTickets: number;
  note?: string;
};
