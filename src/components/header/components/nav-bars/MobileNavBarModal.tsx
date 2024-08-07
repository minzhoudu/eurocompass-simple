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
      className={`top-20 z-10 w-full bg-[#2a4060] text-white ${isOpen ? "absolute" : "hidden"} lg:hidden`}
    >
      <ul className="flex flex-col">
        {NAV_LINKS.map((link) => (
          <li key={link.id} className="flex w-full">
            <NavLink
              to={link.path}
              onClick={closeNav}
              className={({ isActive }) =>
                `w-full py-7 text-center text-xl font-bold transition-all duration-500 ease-in-out hover:bg-[#fff312c5] ${isActive ? "bg-[#fff312c5] text-black" : "text-white"}`
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
