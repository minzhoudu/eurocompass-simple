import { IoLogOutOutline, IoOpenOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { useUserContext } from "../../../contexts";
import { IconButton } from "../../../shared";
import { ThemeToggle } from "../../header/components/theme-toggle";
import { MobileTabBar } from "../../mobile-tab-bar/MobileTabBar";
import logo from "/images/eurocompass_logo.webp";
import { getAdminNavLinks } from "./adminNav";
import { useAdminLogout } from "./useAdminLogout";

export const AdminTopBar = () => {
  const { user } = useUserContext();
  const { logout, isLoggingOut } = useAdminLogout();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-raised/95 px-4 backdrop-blur lg:hidden print:hidden">
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
  const { user } = useUserContext();

  return (
    <MobileTabBar
      label="Admin"
      links={getAdminNavLinks(user?.role).map((link) => ({
        id: link.id,
        label: link.shortLabel,
        path: link.path,
        icon: link.icon,
        activeIcon: link.activeIcon,
        end: link.end,
      }))}
    />
  );
};
