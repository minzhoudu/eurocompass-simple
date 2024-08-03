import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "./utils";

export const Header = () => {
  return (
    <nav className="flex h-20 w-3/4 items-center justify-between rounded-b-xl bg-[#2a4060] px-10">
      <div>
        <Link to="/" className="text-2xl font-bold">
          {/* //TODO Add logo */}
          EUROCOMPASS
        </Link>
      </div>

      <ul className="flex gap-10 text-2xl font-bold">
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                (isActive ? "bg-[#fff312c5] text-black" : "text-white") +
                " rounded-lg px-4 py-2 transition-all duration-500 ease-in-out hover:bg-[#fff312c5] hover:bg-opacity-80 hover:text-black"
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
