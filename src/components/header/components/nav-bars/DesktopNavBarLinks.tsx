import { NavLink } from "react-router-dom";

import { NAV_LINKS } from "../../utils";

export const DesktopNavBarLinks = () => {
  return (
    <ul className="hidden gap-10 text-2xl font-bold lg:flex">
      {NAV_LINKS.map((link) => (
        <li key={link.id}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `${isActive ? "bg-primaryYellow text-black" : "text-white"} rounded-lg px-4 py-2 transition-all duration-500 ease-in-out hover:bg-primaryYellow hover:bg-opacity-80 hover:text-black`
            }
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
