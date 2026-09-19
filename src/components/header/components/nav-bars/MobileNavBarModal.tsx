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
      className={`bg-brand-black-900 top-20 z-10 w-full text-white ${isOpen ? "absolute" : "hidden"} lg:hidden`}
    >
      <ul className="flex flex-col">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="flex w-full">
            <NavLink
              to={link.path}
              onClick={closeNav}
              className={({ isActive }) =>
                `w-full py-7 text-center text-xl font-bold transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500 hover:text-brand-black-900 ${isActive ? "bg-brand-yellow-500 text-brand-black-900" : "text-white"}`
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
