import { Seo } from "../../components";
import { Card, ReservationForm, SectionHeading } from "../../shared";

export const Reservations = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 px-4 lg:px-0">
      <Seo
        title="Rezervacija karte Kruševac – Beograd | Eurocompass"
        description="Rezervišite autobusku kartu Kruševac – Beograd ili Beograd – Kruševac online: izaberite stanicu, datum i vreme polaska u nekoliko klikova."
        path="/rezervacije"
      />

      <SectionHeading as="h1" className="mt-10">
        Rezervacija karte
      </SectionHeading>

      <Card className="w-full max-w-2xl">
        <ReservationForm />
      </Card>
    </div>
  );
};
