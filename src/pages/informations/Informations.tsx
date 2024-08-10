import { Helmet } from "react-helmet";
import { Devider, Price, TravelTime } from "../../shared";
import { InformationsContainer, InformationsParagraph } from "../../components";

export const Informations = () => {
  return (
    <div className="flex w-3/4 flex-col items-center gap-14 lg:w-2/3">
      <Helmet>
        <title>Eurocompass doo | Informacije</title>
        <meta
          name="description"
          content="Informacije o cenama i polascima autobusa Eurocompass"
        />
      </Helmet>

      <div className="mt-10 flex flex-col self-center rounded-lg bg-primaryYellow px-5 py-3 text-center text-xl font-bold lg:text-left lg:text-2xl">
        <h1>Informacije o cenama i polascima</h1>
      </div>

      <InformationsContainer textCenter>
        <InformationsParagraph>
          Petkom u <TravelTime>13:00</TravelTime> iz Kruševca povratna karta je{" "}
          <Price>2.050,00 RSD</Price>
        </InformationsParagraph>

        <Devider />

        <InformationsParagraph>
          Nedeljom iz Kruševca ujutru u <TravelTime>7:00</TravelTime> povratak
          iz Beograda u <TravelTime>21:00</TravelTime> povratna karte je{" "}
          <Price>1.630,00 RSD</Price>
        </InformationsParagraph>
      </InformationsContainer>

      <InformationsContainer textCenter>
        <h2 className="self-center rounded-md bg-primaryYellow px-3 py-1 text-lg font-bold tracking-wide lg:text-xl">
          Akcije
        </h2>
        <InformationsParagraph>
          Uz dve povratne karte od <Price>2.300,00 RSD</Price> treća povrtna
          karta je za
          <Price>2.050,00 RSD</Price>
        </InformationsParagraph>

        <Devider />

        <InformationsParagraph>
          Uz tri studentske karte od
          <Price> 1.880,00 RSD</Price>
          četvrta je za <Price>1.550,00 RSD</Price>
        </InformationsParagraph>
      </InformationsContainer>

      <InformationsContainer>
        <h2 className="gap-3 self-center rounded-md border-2 border-red-700 bg-primaryYellow px-3 py-1 font-bold">
          VAŽNO
        </h2>
        <InformationsParagraph className="text-center underline underline-offset-2">
          KARTE NA BAS-u KUPUJETE DO STALAĆA A MI VAS VOZIMO DO KRUŠEVCA{" "}
        </InformationsParagraph>
      </InformationsContainer>
    </div>
  );
};
