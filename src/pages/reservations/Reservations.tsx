import { Helmet } from "react-helmet";
import { Card, ReservationForm, SectionHeading } from "../../shared";

export const Reservations = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 lg:px-0">
      <Helmet>
        <title>Eurocompass doo | Rezervacija karte</title>
        <meta
          name="description"
          content="Rezervacija karte za prevoz putnika na relaciji Kruševac - Beograd i Beograd - Kruševac. Rezervišite autobuske karte brzo i lako online. Jednostavna i sigurna rezervacija u par klikova."
        />
      </Helmet>

      <SectionHeading as="h1" className="mt-10">
        Rezervacija karte
      </SectionHeading>

      <Card className="w-full max-w-2xl">
        <ReservationForm />
      </Card>
    </div>
  );
};
