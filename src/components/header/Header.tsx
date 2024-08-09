import { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";

import { DesktopNavBarLinks, MobileNavBarModal } from "./components";
import logo from "/images/eurocompass_logo.webp";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <nav className="z-10 flex h-20 w-full items-center justify-between rounded-b-xl bg-[#2a4060] px-10 lg:w-3/4">
        <Link to="/" className="w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6">
          <img
            src={logo}
            alt="eurocompass_logo"
            className="max-h-full w-full"
          />
        </Link>

        {isNavOpen ? (
          <IoCloseSharp
            className="size-7 cursor-pointer lg:hidden"
            onClick={() => setIsNavOpen(false)}
          />
        ) : (
          <GiHamburgerMenu
            className="size-7 cursor-pointer lg:hidden"
            onClick={() => setIsNavOpen(true)}
          />
        )}

        <DesktopNavBarLinks />
      </nav>

      <MobileNavBarModal
        isOpen={isNavOpen}
        closeNav={() => setIsNavOpen(false)}
      />
    </>
  );
};
