import { Helmet } from "react-helmet";
import { Devider, Price, TravelTime } from "../../shared";

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

      <div className="my-10 flex flex-col self-center rounded-lg bg-primaryYellow px-5 py-3 text-center text-xl font-bold lg:text-left lg:text-2xl">
        <h1>Informacije o cenama i polascima</h1>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-lg bg-primaryBlue p-5 text-center font-semibold text-white lg:text-left lg:text-xl">
        <p>
          Petkom u <TravelTime>13:00</TravelTime> iz Kruševca povratna karta je{" "}
          <Price>2.050,00 RSD</Price>
        </p>

        <Devider />

        <p>
          Nedeljom iz Kruševca ujutru u <TravelTime>7:00</TravelTime> povratak
          iz Beograda u <TravelTime>21:00</TravelTime> povratna karte je{" "}
          <Price>1.630,00 RSD</Price>
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-lg bg-primaryBlue p-5 text-center font-semibold lg:text-left lg:text-xl">
        <h2 className="self-center rounded-md bg-primaryYellow px-3 py-1 text-lg font-bold tracking-wide lg:text-xl">
          Akcije
        </h2>
        <p className="text-white">
          Uz dve povratne karte od <Price>2.300,00 RSD</Price> treća povrtna
          karta je za
          <Price>2.050,00 RSD</Price>
        </p>

        <Devider />

        <p className="text-white">
          Uz tri studentske karte od
          <Price> 1.880,00 RSD</Price>
          četvrta je za <Price>1.550,00 RSD</Price>
        </p>
      </div>

      <div className="border-primaryYellow flex w-full flex-col items-center gap-2 rounded-lg border-4 bg-primaryBlue p-5 font-semibold lg:text-xl">
        <h2 className="gap-3 rounded-md border-2 border-red-700 bg-primaryYellow px-3 py-1 font-bold">
          VAŽNO
        </h2>
        <p className="text-center text-white underline underline-offset-2">
          KARTE NA BAS-u KUPUJETE DO STALAĆA A MI VAS VOZIMO DO KRUŠEVCA{" "}
        </p>
      </div>
    </div>
  );
};
