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
              `${isActive ? "bg-brand-yellow-500 text-brand-black-900" : "text-white"} rounded-lg px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500 hover:text-brand-black-900`
            }
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
