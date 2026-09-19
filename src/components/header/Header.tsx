import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

import { DesktopNavBarLinks, MobileNavBarModal } from "./components";
import logo from "/images/eurocompass_logo.webp";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-20 w-full bg-white/95 backdrop-blur transition-shadow duration-300 ${isScrolled ? "shadow-md" : "border-b border-gray-100"}`}
      >
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
            <img
              src={logo}
              alt="eurocompass_logo"
              className="max-h-full w-full"
            />
          </Link>

          {isNavOpen ? (
            <IoCloseSharp
              className="size-7 cursor-pointer text-brand-black-900 lg:hidden"
              onClick={() => setIsNavOpen(false)}
            />
          ) : (
            <GiHamburgerMenu
              className="size-7 cursor-pointer text-brand-black-900 lg:hidden"
              onClick={() => setIsNavOpen(true)}
            />
          )}

          <DesktopNavBarLinks />
        </div>
      </nav>

      <MobileNavBarModal
        isOpen={isNavOpen}
        closeNav={() => setIsNavOpen(false)}
      />
    </>
  );
};
