import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";

import { HomePageCarousel } from "../../components/carousel";
import axiosInstance from "../../config/axiosInstance";
import { InformationResponse } from "../../shared";

export const HomePage = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<InformationResponse>("/information");
      return data;
    },
    staleTime: 1000 * 60 * 30,
  });

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

      <div className="flex flex-col gap-20 lg:flex-row">
        <div className="flex flex-col items-center gap-5 rounded-lg bg-primaryYellow p-5 text-xl font-bold text-black">
          <h2>Prevoz putnika na relaciji</h2>

          <div className="mt-7 flex flex-col gap-10">
            <p className="border border-black p-1">Kruševac - Beograd</p>
            <p className="border border-black p-1">Beograd - Kruševac</p>
          </div>
        </div>

        {!isError ? (
          <div className="flex flex-col gap-5 rounded-lg bg-primaryYellow p-5 text-center text-xl font-bold text-black">
            <h2>Polasci:</h2>

            {!isLoading ? (
              <div className="flex flex-row items-center gap-10">
                <div className="flex-1 border border-black p-3">
                  <h3>Kruševac</h3>
                  <ul className="underline">
                    {data?.info?.startingTimesKrusevac
                      .sort()
                      .map((time, index) => <li key={index}>{time}</li>)}
                  </ul>
                </div>

                <div className="flex-1 border border-black p-3">
                  <h3>Beograd</h3>
                  <ol className="underline">
                    {data?.info?.startingTimesBeograd
                      .sort()
                      .map((time, index) => <li key={index}>{time}</li>)}

                    {data?.info?.saturdayBeograd &&
                      data?.info?.saturdayBeograd.length && (
                        <>
                          <li className="mt-1 border-b-2 border-dashed border-black"></li>
                          <li>nedeljom</li>
                          {data?.info?.saturdayBeograd
                            .sort()
                            .map((time, index) => <li key={index}> {time}</li>)}
                        </>
                      )}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="animate-pulse">Učitavanje podataka...</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center font-semibold text-red-700">
            <p>Došlo je do greške prilikom učitavanja podataka</p>
            <p>Pokušajte ponovo</p>
          </div>
        )}
      </div>
    </>
  );
};
