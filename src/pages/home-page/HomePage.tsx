import { Helmet } from "react-helmet";

import { Departures } from "../../components/departures";
import { RouteMap } from "../../components/route-map";
import { Alert, Card, SectionHeading, useInformation } from "../../shared";

export const HomePage = () => {
  const { data, isError, isLoading } = useInformation();

  return (
    <>
      <Helmet>
        <title>Eurocompass doo | Početna stranica</title>
        <meta
          name="description"
          content="Eurocompass doo - Prevoz putnika na relaciji Kruševac - Beograd i Beograd - Kruševac. Autobus Kruševac - Beograd i Beograd - Kruševac"
        />
      </Helmet>
      <div className="relative left-1/2 h-72 w-screen -translate-x-1/2 self-start overflow-hidden bg-brand-yellow-500/10 sm:h-96 lg:h-[30rem]">
        <RouteMap />

        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-8 lg:px-10 lg:pb-12">
            <h1 className="text-3xl font-bold tracking-wide text-ink sm:text-5xl lg:text-6xl">
              Eurocompass
            </h1>
            <span className="mt-3 block h-1 w-16 rounded-full bg-brand-yellow-500" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 lg:px-0">
        <Card className="flex flex-col gap-8">
          <SectionHeading eyebrow="Prevoz putnika na relaciji">
            Polasci
          </SectionHeading>

          {!isError ? (
            <Departures
              isLoading={isLoading}
              krusevac={data?.info?.startingTimesKrusevac}
              beograd={data?.info?.startingTimesBeograd}
              beogradSunday={data?.info?.saturdayBeograd}
            />
          ) : (
            <Alert variant="error">
              Došlo je do greške prilikom učitavanja podataka. Pokušajte ponovo.
            </Alert>
          )}
        </Card>
      </div>
    </>
  );
};
