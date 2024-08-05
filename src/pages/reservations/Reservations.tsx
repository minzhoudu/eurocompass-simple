import { ReservationForm } from "../../shared";

export const Reservations = () => {
  return (
    <div className="mt-10">
      <div className="mb-5 text-center text-2xl font-bold underline underline-offset-8">
        <h1>Rezervacija karte</h1>
      </div>

      <ReservationForm />
    </div>
  );
};
