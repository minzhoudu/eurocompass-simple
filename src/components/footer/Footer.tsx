import { Link } from "react-router-dom";

import { NAV_LINKS } from "../header/utils";
import { Addresses, Brand, Contacts, SocialNetworks } from "./components";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-line bg-raised text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.4fr_1.2fr_1fr] lg:gap-8 lg:px-10">
        <Brand />

        <Contacts />

        <Addresses />

        <SocialNetworks />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-ink-muted sm:flex-row lg:px-10">
          <p>
            © {year} Eurocompass D.o.o
          </p>

          <nav aria-label="Footer">
            <ul className="flex gap-5 font-semibold">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.path}
                    className="transition-colors hover:text-accent-ink"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
