import { NavLink } from "react-router-dom";

import { NAV_LINKS } from "../../utils";

export const DesktopNavBarLinks = () => {
  return (
    <ul className="hidden gap-2 text-base font-semibold lg:flex">
      {NAV_LINKS.map((link) => (
        <li key={link.id}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              `${isActive ? "bg-brand-yellow-50 text-brand-yellow-700" : "text-brand-black-900"} rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-brand-yellow-50 hover:text-brand-yellow-700`
            }
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
