import { Helmet } from "react-helmet";

import { RouteMap } from "../../components/route-map";
import {
  Alert,
  Badge,
  Card,
  SectionHeading,
  Skeleton,
  useInformation,
} from "../../shared";

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
            <h1 className="text-4xl font-bold tracking-wide text-ink sm:text-5xl lg:text-6xl">
              Eurocompass D.o.o
            </h1>
            <span className="mt-3 block h-1 w-16 rounded-full bg-brand-yellow-500" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 px-4 lg:flex-row lg:px-0">
        <Card className="flex flex-1 flex-col items-center gap-5">
          <SectionHeading>Prevoz putnika na relaciji</SectionHeading>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Badge variant="black">Kruševac - Beograd</Badge>
            <Badge variant="black">Beograd - Kruševac</Badge>
          </div>
        </Card>

        {!isError ? (
          <Card className="flex flex-1 flex-col items-center gap-5">
            <SectionHeading>Polasci</SectionHeading>

            {!isLoading ? (
              <div className="flex w-full flex-row justify-center gap-10">
                <div className="flex flex-1 flex-col items-center">
                  <h3 className="mb-3 font-bold text-ink">
                    Kruševac
                  </h3>
                  <ul className="flex flex-col items-center gap-2">
                    {data?.info?.startingTimesKrusevac
                      .sort()
                      .map((time, index) => (
                        <li key={index}>
                          <Badge variant="outline">{time}</Badge>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="flex flex-1 flex-col items-center">
                  <h3 className="mb-3 font-bold text-ink">
                    Beograd
                  </h3>
                  <ul className="flex flex-col items-center gap-2">
                    {data?.info?.startingTimesBeograd
                      .sort()
                      .map((time, index) => (
                        <li key={index}>
                          <Badge variant="outline">{time}</Badge>
                        </li>
                      ))}

                    {data?.info?.saturdayBeograd &&
                      data?.info?.saturdayBeograd.length > 0 && (
                        <>
                          <li className="my-1 w-full border-t border-dashed border-line-strong" />
                          <li>
                            <Badge variant="yellow">nedeljom</Badge>
                          </li>
                          {data?.info?.saturdayBeograd
                            .sort()
                            .map((time, index) => (
                              <li key={index}>
                                <Badge variant="outline">{time}</Badge>
                              </li>
                            ))}
                        </>
                      )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-row gap-10">
                <Skeleton className="h-32 flex-1" />
                <Skeleton className="h-32 flex-1" />
              </div>
            )}
          </Card>
        ) : (
          <Card className="flex flex-1 items-center justify-center">
            <Alert variant="error">
              Došlo je do greške prilikom učitavanja podataka. Pokušajte
              ponovo.
            </Alert>
          </Card>
        )}
      </div>
    </>
  );
};
