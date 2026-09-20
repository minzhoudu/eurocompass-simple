import { Helmet } from "react-helmet";
import { BookingChannels, FareTicket, GoogleMap } from "../../components";
import { Alert, SectionHeading, Skeleton, useInformation } from "../../shared";

export const Informations = () => {
  const { data, isError, isLoading } = useInformation();
  const info = data?.info;

  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 px-4 lg:px-0">
      <Helmet>
        <title>Eurocompass doo | Informacije</title>
        <meta
          name="description"
          content="Informacije o cenama karata, specijalnim ponudama i polascima autobusa Eurocompass. Pronađite sve potrebne informacije o destinacijama, polascima i cenama na našoj stranici."
        />
      </Helmet>

      <SectionHeading as="h1" className="mt-10">
        Informacije o cenama i polascima
      </SectionHeading>

      {!isError ? (
        !isLoading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <FareTicket label="Jedan smer" price={info?.regularPrice} />
              <FareTicket
                label="Povratna karta"
                price={info?.roundtripPrice}
              />
              <FareTicket
                label="Studentska povratna karta"
                price={info?.studentPrice}
              />
            </div>

            {info && info.importantInfo.length > 0 && (
              <Alert variant="warning" title="VAŽNO" className="w-full">
                <ul className="flex flex-col gap-2 text-base">
                  {info.importantInfo.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-yellow-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
          </>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-44" />
              <Skeleton className="h-44" />
              <Skeleton className="h-44" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        )
      ) : (
        <Alert variant="error" className="w-full text-center font-bold">
          Došlo je do greške! Pokušajte ponovo kasnije...
        </Alert>
      )}

      <BookingChannels />

      <GoogleMap />
    </div>
  );
};
