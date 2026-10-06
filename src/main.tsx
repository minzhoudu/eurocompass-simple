import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import { OwnerRoute } from "./components/protected-route/OwnerRoute";
import { UserProvider } from "./contexts";
import { AppLayout } from "./layouts";
import { listenForInstallPrompt, registerServiceWorker } from "./pwa";
import {
  AdminAuditLog,
  AdminDashboard,
  AdminInformations,
  AdminLayout,
  AdminLoginPage,
  AdminNotices,
  AdminPassengers,
  AdminReservations,
  AdminSuspense,
  AdminUsers,
} from "./routes/lazyAdmin";
import {
  ErrorPage,
  HomePage,
  Informations,
  NotFound,
  PrivacyPolicy,
  Reservations,
} from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage redirectPath="/" />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "rezervacije",
        element: <Reservations />,
      },
      {
        path: "informacije",
        element: <Informations />,
      },
      {
        path: "politika-privatnosti",
        element: <PrivacyPolicy />,
      },
      {
        // Anything else is a real "not found" page, not a silent redirect.
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/admin",
    errorElement: <ErrorPage redirectPath="/admin" />,
    children: [
      {
        index: true,
        element: (
          <AdminSuspense>
            <AdminLoginPage />
          </AdminSuspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <AdminSuspense>
            <UserProvider>
              <AdminLayout />
            </UserProvider>
          </AdminSuspense>
        ),
        children: [
          {
            index: true,
            element: (
              <AdminSuspense>
                <AdminDashboard />
              </AdminSuspense>
            ),
          },
          {
            path: "informacije",
            element: (
              <AdminSuspense>
                <AdminInformations />
              </AdminSuspense>
            ),
          },
          {
            path: "rezervacije",
            element: (
              <AdminSuspense>
                <AdminReservations />
              </AdminSuspense>
            ),
          },
          {
            path: "putnici",
            element: (
              <AdminSuspense>
                <AdminPassengers />
              </AdminSuspense>
            ),
          },
          {
            path: "obavestenja",
            element: (
              <AdminSuspense>
                <AdminNotices />
              </AdminSuspense>
            ),
          },
          {
            path: "istorija",
            element: (
              <OwnerRoute>
                <AdminSuspense>
                  <AdminAuditLog />
                </AdminSuspense>
              </OwnerRoute>
            ),
          },
          {
            path: "administratori",
            element: (
              <OwnerRoute>
                <AdminSuspense>
                  <AdminUsers />
                </AdminSuspense>
              </OwnerRoute>
            ),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="font-sans">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  </React.StrictMode>,
);

listenForInstallPrompt();
registerServiceWorker();
