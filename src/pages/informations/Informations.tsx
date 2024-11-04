import { Helmet } from "react-helmet";
import {
  InformationsContainer,
  InformationsParagraph,
  InformationTitle,
} from "../../components";
import { Price } from "../../shared";

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
        <InformationTitle>Cene karata</InformationTitle>
        <InformationsParagraph className="text-center">
          Redovna cena karte je <Price>2.600,00 RSD</Price>
        </InformationsParagraph>
      </InformationsContainer>

      <InformationsContainer>
        <InformationTitle className="border-2 border-red-700">
          VAŽNO
        </InformationTitle>
        <InformationsParagraph className="text-center underline underline-offset-2">
          KARTE NA BAS-u KUPUJETE DO STALAĆA A MI VAS VOZIMO DO KRUŠEVCA{" "}
        </InformationsParagraph>
      </InformationsContainer>
    </div>
  );
};
