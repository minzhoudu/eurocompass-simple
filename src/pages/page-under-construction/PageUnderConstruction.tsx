import { Seo } from "../../components";
import { Link } from "react-router-dom";

export const PageUnderConstruction = () => {
  return (
    <div className="flex h-[calc(100vh-20rem)] flex-col items-center justify-center gap-5 font-semibold">
      <Seo
        title="Stranica u izradi | Eurocompass"
        description="Ova stranica je u izradi."
        path="/"
        noindex
      />
      <div className="text-center">
        <h1 className="text-3xl">Stranica je u izradi</h1>
        <p>Molim vas vratite se kasnije</p>
      </div>

      <Link to="/" className="rounded-lg bg-brand-yellow-500 p-2 text-brand-black-900">
        Vrati se na početnu stranu
      </Link>
    </div>
  );
};
