type MobileNavBarProps = {
  toggleNavBar: boolean;
};

import { ReactNode } from "react";
import { createPortal } from "react-dom";

const mountElement = document.getElementById("root")!;

export const MobileNavBarModal = ({
  toggleNavBar,
}: MobileNavBarProps): ReactNode => {
  return (
    <>
      {createPortal(
        <nav
          className={`left-0 top-0 h-screen w-full bg-black opacity-70 blur-xl ${toggleNavBar ? "fixed" : "hidden"}`}
        >
          {toggleNavBar ? "Mobile NavBar open" : "Mobile NavBar closed"}
        </nav>,
        mountElement,
      )}
    </>
  );
};
