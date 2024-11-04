import { Helmet } from "react-helmet";
import { ReservationForm } from "../../shared";

export const Reservations = () => {
  return (
    <div className="mt-10">
      <Helmet>
        <title>Eurocompass doo | Rezervacija karte</title>
        <meta
          name="description"
          content="Rezervacija karte za prevoz putnika na relaciji Kruševac - Beograd i Beograd - Kruševac. Rezervišite autobuske karte brzo i lako online. Jednostavna i sigurna rezervacija u par klikova."
        />
      </Helmet>
      <div className="mb-5 rounded-lg bg-primaryYellow px-5 py-3 text-center text-2xl font-bold">
        <h1>Rezervacija karte</h1>
      </div>

      <ReservationForm />
    </div>
  );
};
