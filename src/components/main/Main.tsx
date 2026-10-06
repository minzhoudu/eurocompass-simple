import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

// The page's single <main> landmark. tabIndex -1 lets the skip link and the
// route-change handler move keyboard focus here without adding a tab stop.
export const Main = ({ children }: MainProps) => {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex w-full flex-1 flex-col items-center justify-center gap-24 pb-24 outline-none lg:w-3/4"
    >
      {children}
    </main>
  );
};
