import { IoLogOutOutline, IoOpenOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

import { useUserContext } from "../../../contexts";
import { IconButton } from "../../../shared";
import { ThemeToggle } from "../../header/components/theme-toggle";
import logo from "/images/eurocompass_logo.webp";
import { ADMIN_NAV_LINKS } from "./adminNav";
import { useAdminLogout } from "./useAdminLogout";

const tabClasses =
  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors min-[400px]:text-xs";

export const AdminTopBar = () => {
  const { user } = useUserContext();
  const { logout, isLoggingOut } = useAdminLogout();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-raised/95 px-4 backdrop-blur print:hidden lg:hidden">
      <Link to="/admin/dashboard" className="block w-32 shrink-0">
        <img src={logo} alt="Eurocompass" className="w-full" />
      </Link>

      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate text-sm font-semibold text-ink-muted">
          {user?.firstName}
        </span>
        <ThemeToggle />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pogledaj sajt"
          title="Pogledaj sajt"
          className="inline-flex size-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
        >
          <IoOpenOutline className="size-5" />
        </a>

        <IconButton
          label="Izloguj se"
          onClick={logout}
          disabled={isLoggingOut}
          className="sm:size-10"
        >
          <IoLogOutOutline className="size-5" />
        </IconButton>
      </div>
    </header>
  );
};

export const AdminTabBar = () => {
  return (
    <nav
      aria-label="Admin"
      className="fixed inset-x-0 bottom-0 z-20 grid auto-cols-fr grid-flow-col border-t print:hidden border-line bg-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
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

    </nav>
  );
};
