import { Outlet } from "react-router-dom";
import { Header, Footer, Main, NoticeBanner, RouteFocus } from "../components";
import { cn, useTheme } from "../shared";

export const AppLayout = () => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center bg-surface text-ink",
        theme === "dark" && "dark",
      )}
    >
      {/* First tab stop: lets keyboard and screen-reader users skip the
          navigation. Hidden until it receives focus. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-yellow-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-black-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-black-900"
      >
        Preskoči na sadržaj
      </a>

      {/* One sticky unit so the banner stays on top and the header sits right
          below it while scrolling, whatever the banner's height. */}
      <div className="sticky top-0 z-30 w-full">
        <NoticeBanner />

        <header>
          <Header />
        </header>
      </div>

      <Main>
        <Outlet />
      </Main>

      <Footer />

      <RouteFocus />
    </div>
  );
};
