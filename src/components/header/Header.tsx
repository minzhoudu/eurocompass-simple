import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

import {
  DesktopNavBarLinks,
  MobileNavBarModal,
  ThemeToggle,
} from "./components";
import logo from "/images/eurocompass_logo.webp";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      setIsNavOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isNavOpen]);

  return (
    <>
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

            {/* A real button (not a clickable icon): reachable by keyboard and
                announced with its state. */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsNavOpen((open) => !open)}
              aria-expanded={isNavOpen}
              aria-controls="mobile-navigation"
              aria-label={isNavOpen ? "Zatvori meni" : "Otvori meni"}
              className="flex size-10 items-center justify-center rounded-md text-ink transition-colors hover:bg-brand-yellow-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow-500 lg:hidden"
            >
              {isNavOpen ? (
                <IoCloseSharp className="size-7" aria-hidden="true" />
              ) : (
                <GiHamburgerMenu className="size-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <MobileNavBarModal
        isOpen={isNavOpen}
        closeNav={() => setIsNavOpen(false)}
      />
    </>
  );
};
