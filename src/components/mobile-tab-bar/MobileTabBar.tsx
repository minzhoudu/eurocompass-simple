import { useEffect, useRef } from "react";
import { IconType } from "react-icons";
import { NavLink, useLocation } from "react-router-dom";

export type TabBarLink = {
  id: number;
  label: string;
  path: string;
  icon: IconType;
  // Filled version shown for the open page; falls back to `icon`.
  activeIcon?: IconType;
  end?: boolean;
};

type MobileTabBarProps = {
  // Accessible name of the navigation landmark.
  label: string;
  links: TabBarLink[];
};

const tabClasses =
  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors min-[400px]:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-yellow-500";

// The app-style bar fixed to the bottom of a phone screen, shared by the public
// site and the admin panel: outline icons, the open page in the accent colour
// with a filled icon. Phones and tablets only (the desktop has its own menu).
export const MobileTabBar = ({ label, links }: MobileTabBarProps) => {
  const { pathname } = useLocation();
  const barRef = useRef<HTMLElement>(null);

  // With more tabs than fit, the bar scrolls sideways; keep the open page's
  // tab in view.
  useEffect(() => {
    const active = barRef.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );

    // Scrolls the bar itself only (it is fixed, so the page doesn't move).
    active?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname, links.length]);

  return (
    <nav
      ref={barRef}
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-20 grid auto-cols-[minmax(4.5rem,1fr)] grid-flow-col overflow-x-auto border-t border-line bg-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden"
    >
      {links.map((link) => (
        <NavLink
          key={link.id}
          to={link.path}
          end={link.end}
          className={({ isActive }) =>
            `${tabClasses} ${isActive ? "text-accent-ink" : "text-ink-muted"}`
          }
        >
          {({ isActive }) => {
            const Icon =
              isActive && link.activeIcon ? link.activeIcon : link.icon;

            return (
              <>
                <Icon className="size-6" aria-hidden="true" />
                {link.label}
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
};
