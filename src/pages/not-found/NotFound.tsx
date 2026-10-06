import { Link } from "react-router-dom";

import { Seo } from "../../components";
import { getButtonClasses } from "../../shared";

// Shown for any address that is not a page. (Direct visits to such addresses are
// answered with a real 404 by the host - see public/_redirects and 404.html.)
export const NotFound = () => (
  <div className="flex flex-col items-center gap-6 px-4 py-24 text-center">
    <Seo
      title="Stranica nije pronađena | Eurocompass"
      description="Stranica koju tražite ne postoji."
      path="/"
      noindex
    />

    <h1 className="text-3xl font-bold text-ink sm:text-4xl">
      Stranica nije pronađena
    </h1>
    <p className="max-w-md text-ink-muted">
      Adresa koju ste uneli ne postoji ili je stranica premeštena. Pogledajte
      polaske ili rezervišite kartu.
    </p>

    <div className="flex flex-wrap justify-center gap-3">
      <Link to="/" className={getButtonClasses()}>
        Početna strana
      </Link>
      <Link
        to="/rezervacije"
        className={getButtonClasses({ variant: "outline" })}
      >
        Rezervacija karte
      </Link>
    </div>
  </div>
);
