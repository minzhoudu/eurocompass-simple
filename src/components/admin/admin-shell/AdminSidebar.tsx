import { IoLogOutOutline, IoOpenOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

import { useUserContext } from "../../../contexts";
import { ThemeToggle } from "../../header/components/theme-toggle";
import logo from "/images/eurocompass_logo.webp";
import { ADMIN_NAV_LINKS } from "./adminNav";
import { useAdminLogout } from "./useAdminLogout";

const linkClasses =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-semibold transition-colors";

export const AdminSidebar = () => {
  const { user } = useUserContext();
  const { logout, isLoggingOut } = useAdminLogout();

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-line bg-raised p-5 lg:flex">
      <Link to="/admin/dashboard" className="block w-40">
        <img src={logo} alt="Eurocompass" className="w-full" />
      </Link>

      <nav aria-label="Admin" className="flex flex-col gap-1">
        {ADMIN_NAV_LINKS.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? "bg-brand-yellow-500/10 text-accent-ink" : "text-ink-muted hover:bg-sunken hover:text-ink"}`
            }
          >
            <link.icon className="size-5" />
            {link.label}
          </NavLink>
        ))}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClasses} mt-3 border-t border-line pt-4 text-accent-ink hover:bg-brand-yellow-500/10`}
        >
          <IoOpenOutline className="size-5" />
          Pogledaj sajt
        </a>
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow-500/20 font-bold uppercase text-accent-ink"
          >
            {initials}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-sm text-ink-muted">{user?.email}</p>
          </div>

          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={logout}
          disabled={isLoggingOut}
          className={`${linkClasses} text-ink-muted hover:bg-sunken hover:text-ink disabled:opacity-50`}
        >
          <IoLogOutOutline className="size-5" />
          Izloguj se
        </button>
      </div>
    </aside>
  );
};
