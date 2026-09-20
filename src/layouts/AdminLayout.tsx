import { Outlet } from "react-router-dom";

import { AdminSidebar, AdminTabBar, AdminTopBar } from "../components";
import { cn, useTheme } from "../shared";

export const AdminLayout = () => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen bg-surface text-ink lg:flex",
        theme === "dark" && "dark",
      )}
    >
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar />

        <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>

      <AdminTabBar />
    </div>
  );
};
