import { Outlet } from "react-router-dom";
import { Header, Footer, Main } from "../components";
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
      <Header />

      <Main>
        <Outlet />
      </Main>

      <Footer />
    </main>
  );
};
