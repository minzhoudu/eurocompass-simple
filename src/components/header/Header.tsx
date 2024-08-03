import { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import { DesktopNavBarLinks, MobileNavBarModal } from "./components";
import { IoCloseSharp } from "react-icons/io5";

export const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <nav className="z-10 flex h-20 w-full items-center justify-between rounded-b-xl bg-[#2a4060] px-10 lg:w-3/4">
        <div>
          <Link to="/" className="font-bold lg:text-2xl">
            {/* //TODO Add logo */}
            EUROCOMPASS
          </Link>
        </div>

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

      <MobileNavBarModal isOpen={isNavOpen} />
    </>
  );
};
