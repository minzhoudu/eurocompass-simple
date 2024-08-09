import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export const PageUnderConstruction = () => {
  return (
    <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center gap-5 font-semibold">
      <Helmet>
        <title>Eurocompass doo | Stranica u izradi</title>
        <meta
          name="description"
          content="Eurocompass doo | Stranica u izradi"
        />
      </Helmet>
      <div className="text-center">
        <h1 className="text-3xl">Stranica u izradi</h1>
        <p>Molim vas vratite se kasnije</p>
      </div>

      <Link to="/" className="rounded-lg bg-[#fff312c5] p-2">
        Vrati se na početnu stranu
      </Link>
    </div>
  );
};
