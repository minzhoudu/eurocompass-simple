import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { Helmet } from "react-helmet";

import { HomePageCarousel } from "../../components/carousel";
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
      <div className="w-full">
        <HomePageCarousel />
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
                  <h3 className="mb-3 font-bold text-brand-black-900">
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
                  <h3 className="mb-3 font-bold text-brand-black-900">
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
                          <li className="my-1 w-full border-t border-dashed border-gray-300" />
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
