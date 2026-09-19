import { Helmet } from "react-helmet";
import {
  GoogleMap,
  InformationsContainer,
  InformationsParagraph,
  InformationTitle,
} from "../../components";
import {
  Alert,
  Price,
  SectionHeading,
  Skeleton,
  useInformation,
} from "../../shared";

export const Informations = () => {
  const { data, isError, isLoading } = useInformation();

  return (
    <div className="flex w-3/4 flex-col items-center gap-14 lg:w-2/3">
      <Helmet>
        <title>Eurocompass doo | Informacije</title>
        <meta
          name="description"
          content="Informacije o cenama karata, specijalnim ponudama i polascima autobusa Eurocompass. Pronađite sve potrebne informacije o destinacijama, polascima i cenama na našoj stranici."
        />
      </Helmet>

      <SectionHeading as="h1" align="responsive" className="mt-10">
        Informacije o cenama i polascima
      </SectionHeading>

      {!isError ? (
        !isLoading ? (
          <>
            <InformationsContainer textCenter>
              <InformationTitle>Cene karata</InformationTitle>
              <InformationsParagraph className="mx-auto xl:w-1/2">
                Cena karte u jednom smeru:{" "}
                <Price>{data?.info?.regularPrice},00 RSD</Price>
              </InformationsParagraph>
              <InformationsParagraph className="mx-auto xl:w-1/2">
                Povratna karta:{" "}
                <Price>{data?.info?.roundtripPrice},00 RSD</Price>
              </InformationsParagraph>
              <InformationsParagraph className="mx-auto xl:w-1/2">
                Studentska povratna karta:{" "}
                <Price>{data?.info?.studentPrice},00 RSD</Price>
              </InformationsParagraph>
            </InformationsContainer>

            <Alert variant="warning" title="VAŽNO" className="w-full">
              <div className="flex flex-col gap-2 text-center lg:text-left">
                {data?.info?.importantInfo.map((item, idx) => (
                  <p key={idx}>- {item}</p>
                ))}
              </div>
            </Alert>
          </>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )
      ) : (
        <Alert variant="error" className="w-full text-center font-bold">
          Došlo je do greške! Pokušajte ponovo kasnije...
        </Alert>
      )}

      <InformationsContainer textCenter>
        <InformationTitle>Novo</InformationTitle>
        <InformationsParagraph className="mx-auto xl:w-1/2">
          Karte od sada možete rezervisati preko{" "}
          <span className="font-semibold text-[#019c4e]">Whatsapp</span> i{" "}
          <span className="font-semibold text-[#9585ff]">Viber</span>{" "}
          aplikacije.
        </InformationsParagraph>
      </InformationsContainer>

      <GoogleMap />
    </div>
  );
};
