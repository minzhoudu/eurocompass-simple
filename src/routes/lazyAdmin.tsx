import { lazy, ReactNode, Suspense } from "react";

// The admin panel is only used by staff, so its code (charts, forms, tables) is
// loaded on demand instead of being part of the script every visitor downloads.
// Each import points at the admin module itself, not a barrel shared with the
// public pages, so the bundler can split it off.
export const AdminLoginPage = lazy(() =>
  import("../pages/admin-pages/admin-login").then((module) => ({
    default: module.AdminLoginPage,
  })),
);
export const AdminDashboard = lazy(() =>
  import("../pages/admin-pages/admin-dashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
export const AdminReservations = lazy(() =>
  import("../pages/admin-pages/admin-reservations").then((module) => ({
    default: module.AdminReservations,
  })),
);
export const AdminPassengers = lazy(() =>
  import("../pages/admin-pages/admin-passengers").then((module) => ({
    default: module.AdminPassengers,
  })),
);
export const AdminNotices = lazy(() =>
  import("../pages/admin-pages/admin-notices").then((module) => ({
    default: module.AdminNotices,
  })),
);
export const AdminInformations = lazy(() =>
  import("../components/admin/AdminInformations").then((module) => ({
    default: module.AdminInformations,
  })),
);
export const AdminLayout = lazy(() =>
  import("../layouts/AdminLayout").then((module) => ({
    default: module.AdminLayout,
  })),
);

export const AdminSuspense = ({ children }: { children: ReactNode }) => (
  <Suspense
    fallback={
      <div role="status" className="p-8 text-center text-ink-muted">
        Učitavanje...
      </div>
    }
  >
    {children}
  </Suspense>
);
