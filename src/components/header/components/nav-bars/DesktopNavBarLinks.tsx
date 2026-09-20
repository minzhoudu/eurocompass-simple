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
              `${isActive ? "bg-brand-yellow-500/10 text-accent-ink" : "text-ink"} rounded-md px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-brand-yellow-500/10 hover:text-accent-ink`
            }
          >
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
