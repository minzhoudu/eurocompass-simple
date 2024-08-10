import { Price, TravelTime } from "../../shared";

export const Informations = () => {
  return (
    <div className="flex w-2/3 flex-col items-center gap-14">
      <div className="my-10 flex flex-col self-center rounded-lg bg-primaryYellow px-5 py-3 text-2xl font-semibold">
        <h1>Informacije o cenama i polascima</h1>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-lg bg-primaryBlue p-5 text-xl font-semibold text-white">
        <p>
          Petkom u <TravelTime>13:00</TravelTime> iz Kruševca povratna karta je{" "}
          <Price>2.050,00 RSD</Price>
        </p>
        <p>
          Nedeljom iz Kruševca ujutru u <TravelTime>7:00</TravelTime> povratak
          iz Beograda u <TravelTime>21:00</TravelTime> povratna karte je{" "}
          <Price>1.630,00 RSD</Price>
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-lg bg-primaryBlue p-5 text-xl font-semibold">
        <h2 className="self-center rounded-md bg-primaryYellow px-3 py-1 font-bold tracking-wide">
          Akcije
        </h2>
        <p className="text-white">
          Uz dve povratne karte od <Price>2.300,00 RSD</Price> treća povrtna
          karta je za
          <Price>2.050,00 RSD</Price>
        </p>
        <p className="text-white">
          Uz tri studentske karte od
          <Price> 1.880,00 RSD</Price>
          četvrta je za <Price>1.550,00 RSD</Price>
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-primaryBlue p-5 text-xl font-semibold">
        <h2 className="gap-3 rounded-md border-2 border-red-700 bg-primaryYellow px-3 py-1 font-bold">
          VAŽNO
        </h2>
        <p className="text-white underline underline-offset-2">
          KARTE NA BAS-u KUPUJETE DO STALAĆA A MI VAS VOZIMO DO KRUŠEVCA{" "}
        </p>
      </div>
    </div>
  );
};
