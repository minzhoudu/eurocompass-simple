import { Helmet } from "react-helmet";
import { ReservationForm } from "../../shared";

export const Reservations = () => {
  return (
    <div className="mt-10">
      <Helmet>
        <title>Eurocompass doo | Rezervacija karte</title>
        <meta
          name="description"
          content="Rezervacija karte za prevoz putnika na relaciji Kruševac - Beograd i Beograd - Kruševac"
        />
      </Helmet>
      <div className="mb-5 text-center text-2xl font-bold underline underline-offset-8">
        <h1>Rezervacija karte</h1>
      </div>

      <ReservationForm />
    </div>
  );
};
