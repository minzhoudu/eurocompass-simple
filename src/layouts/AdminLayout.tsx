import { Outlet } from "react-router-dom";

import {
  ActivityTracker,
  AdminSidebar,
  AdminTabBar,
  AdminTopBar,
} from "../components";
import { useUserContext } from "../contexts";
import { cn, useTheme } from "../shared";

export const AdminLayout = () => {
  const { theme } = useTheme();
  const { isLoggedIn } = useUserContext();

  return (
    <div
      className={cn(
        "min-h-screen bg-surface text-ink lg:flex lg:h-screen lg:overflow-hidden print:block print:h-auto print:overflow-visible",
        theme === "dark" && "dark",
      )}
    >
      {isLoggedIn && <ActivityTracker />}

      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col lg:min-h-0">
        <AdminTopBar />

        <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:min-h-0 lg:overflow-y-auto lg:px-10 lg:py-10 print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>

      <AdminTabBar />
    </div>
  );
};
