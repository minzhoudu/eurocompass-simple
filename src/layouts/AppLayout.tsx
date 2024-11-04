import { Outlet } from "react-router-dom";
import { Header, Footer, Main } from "../components";

export const AppLayout = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 bg-slate-400">
      <Header />

      <Main>
        <Outlet />
      </Main>

      <Footer />
    </main>
  );
};
