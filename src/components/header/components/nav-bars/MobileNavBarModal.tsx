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
      className={`top-20 z-20 w-full border-b border-gray-100 bg-white text-brand-black-900 shadow-lg ${isOpen ? "fixed" : "hidden"} lg:hidden`}
    >
      <ul className="flex flex-col divide-y divide-gray-100">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="flex w-full">
            <NavLink
              to={link.path}
              onClick={closeNav}
              className={({ isActive }) =>
                `w-full py-6 text-center text-xl font-bold transition-colors duration-300 ease-in-out hover:bg-brand-yellow-50 hover:text-brand-yellow-700 ${isActive ? "bg-brand-yellow-50 text-brand-yellow-700" : "text-brand-black-900"}`
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
