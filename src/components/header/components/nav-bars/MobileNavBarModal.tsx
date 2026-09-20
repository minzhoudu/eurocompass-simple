type MobileNavBarProps = {
  isOpen: boolean;
  closeNav: () => void;
};

import { ReactNode } from "react";
import { NAV_LINKS } from "../../utils";
import { NavLink } from "react-router-dom";

export const MobileNavBarModal = ({
  isOpen,
  closeNav,
}: MobileNavBarProps): ReactNode => {
  return (
    <div
      className={`top-20 z-20 w-full border-b border-line bg-raised text-ink shadow-lg ${isOpen ? "fixed" : "hidden"} lg:hidden`}
    >
      <ul className="flex flex-col divide-y divide-line">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="flex w-full">
            <NavLink
              to={link.path}
              onClick={closeNav}
              className={({ isActive }) =>
                `w-full py-6 text-center text-xl font-bold transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500/10 hover:text-accent-ink ${isActive ? "bg-brand-yellow-500/10 text-accent-ink" : "text-ink"}`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
