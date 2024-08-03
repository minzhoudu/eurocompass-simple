import { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import { DesktopNavBarLinks, MobileNavBarModal } from "./components";
import { IoCloseSharp } from "react-icons/io5";

export const Header = () => {
  const [toggleNavBar, setToggleNavBar] = useState(false);

  return (
    <nav className="z-10 flex h-20 w-3/4 items-center justify-between rounded-b-xl bg-[#2a4060] px-10">
      <div>
        <Link to="/" className="text-2xl font-bold">
          {/* //TODO Add logo */}
          EUROCOMPASS
        </Link>
      </div>

      {toggleNavBar ? (
        <IoCloseSharp
          size={25}
          className="cursor-pointer lg:hidden"
          onClick={() => setToggleNavBar(false)}
        />
      ) : (
        <GiHamburgerMenu
          size={25}
          className="cursor-pointer lg:hidden"
          onClick={() => setToggleNavBar(true)}
        />
      )}

      <DesktopNavBarLinks />
      <MobileNavBarModal toggleNavBar={toggleNavBar} />
    </nav>
  );
};
