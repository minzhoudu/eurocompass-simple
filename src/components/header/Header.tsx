import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DesktopNavBarLinks, ThemeToggle } from "./components";
import logo from "/images/eurocompass_logo.webp";

// On a phone the pages are reached from the bottom tab bar (PublicTabBar), so
// the top bar only carries the logo and the theme switch.
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Glavna navigacija"
      className={`sticky top-0 z-20 w-full bg-raised/95 backdrop-blur transition-shadow duration-300 ${isScrolled ? "shadow-md" : "border-b border-line"}`}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 lg:px-10">
        <Link to="/" className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
          <img
            src={logo}
            alt="Eurocompass - početna strana"
            className="max-h-full w-full"
          />
        </Link>

        <div className="flex items-center gap-2">
          <DesktopNavBarLinks />

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
