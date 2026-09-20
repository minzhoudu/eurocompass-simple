import { IoLogOutOutline, IoOpenOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

import { useUserContext } from "../../../contexts";
import { ThemeToggle } from "../../header/components/theme-toggle";
import logo from "/images/eurocompass_logo.webp";
import { ADMIN_NAV_LINKS } from "./adminNav";
import { useAdminLogout } from "./useAdminLogout";

const tabClasses =
  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold transition-colors";

export const AdminTopBar = () => {
  const { user } = useUserContext();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-raised/95 px-4 backdrop-blur lg:hidden">
      <Link to="/admin/dashboard" className="block w-32 shrink-0">
        <img src={logo} alt="Eurocompass" className="w-full" />
      </Link>

      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate text-sm font-semibold text-ink-muted">
          {user?.firstName}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
};

export const AdminTabBar = () => {
  const { logout, isLoggingOut } = useAdminLogout();

  return (
    <nav
      aria-label="Admin"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      {ADMIN_NAV_LINKS.map((link) => (
        <NavLink
          key={link.id}
          to={link.path}
          end={link.end}
          className={({ isActive }) =>
            `${tabClasses} ${isActive ? "text-accent-ink" : "text-ink-muted"}`
          }
        >
          <link.icon className="size-6" />
          {link.shortLabel}
        </NavLink>
      ))}

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${tabClasses} text-ink-muted`}
      >
        <IoOpenOutline className="size-6" />
        Sajt
      </a>

      <button
        type="button"
        onClick={logout}
        disabled={isLoggingOut}
        className={`${tabClasses} text-ink-muted disabled:opacity-50`}
      >
        <IoLogOutOutline className="size-6" />
        Izlaz
      </button>
    </nav>
  );
};
