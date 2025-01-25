import { Helmet } from "react-helmet";
import {
  InformationsContainer,
  InformationsParagraph,
  InformationTitle,
} from "../../components";
import { InformationResponse, Price } from "../../shared";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";

export const Informations = () => {
  const { data, isError } = useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<InformationResponse>("/information");
      return data;
    },
  });

  return (
    <div className="flex w-3/4 flex-col items-center gap-14 lg:w-2/3">
      <Helmet>
        <title>Eurocompass doo | Informacije</title>
        <meta
          name="description"
          content="Informacije o cenama karata, specijalnim ponudama i polascima autobusa Eurocompass. Pronađite sve potrebne informacije o destinacijama, polascima i cenama na našoj stranici."
        />
      </Helmet>

      <div className="mt-10 flex flex-col self-center rounded-lg bg-primaryYellow px-5 py-3 text-center text-xl font-bold lg:text-left lg:text-2xl">
        <h1>Informacije o cenama i polascima</h1>
      </div>

      {!isError ? (
        <>
          <InformationsContainer textCenter>
            <InformationTitle>Cene karata</InformationTitle>
            <InformationsParagraph className="mx-auto xl:w-1/2">
              Cena karte u jednom smeru:{" "}
              <Price>{data?.info?.regularPrice},00 RSD</Price>
            </InformationsParagraph>
            <InformationsParagraph className="mx-auto xl:w-1/2">
              Povratna karta: <Price>{data?.info?.roundtripPrice},00 RSD</Price>
            </InformationsParagraph>
          </InformationsContainer>

          <InformationsContainer>
            <InformationTitle className="border-2 border-red-700">
              VAŽNO
            </InformationTitle>
            {data?.info?.importantInfo.map((item, idx) => (
              <InformationsParagraph
                key={idx}
                className="text-center underline underline-offset-2"
              >
                {item}
              </InformationsParagraph>
            ))}
          </InformationsContainer>
        </>
      ) : (
        <p className="text-xl font-bold text-red-700">
          Došlo je do greške! Pokušajte ponovo kasnije...
        </p>
      )}
    </div>
  );
};
