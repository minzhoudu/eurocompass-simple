import { Outlet } from "react-router-dom";
import { Header, Footer, Main, NoticeBanner } from "../components";
import { cn, useTheme } from "../shared";

export const AppLayout = () => {
  const { theme } = useTheme();

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center bg-surface text-ink",
        theme === "dark" && "dark",
      )}
    >
      {/* One sticky unit so the banner stays on top and the header sits right
          below it while scrolling, whatever the banner's height. */}
      <div className="sticky top-0 z-30 w-full">
        <NoticeBanner />

        <Header />
      </div>

      <Main>
        <Outlet />
      </Main>

      <Footer />
    </main>
  );
};
