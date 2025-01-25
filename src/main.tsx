import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import { UserProvider } from "./contexts";
import { AdminLayout, AppLayout } from "./layouts";
import {
  AdminDashboard,
  AdminLoginPage,
  ErrorPage,
  HomePage,
  Informations,
  Reservations,
} from "./pages";
import { AdminInformations } from "./components";
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
    ],
  },
  {
    path: "/admin",
    errorElement: <ErrorPage redirectPath="/admin" />,
    children: [
      {
        index: true,
        element: <AdminLoginPage />,
      },
      {
        path: "dashboard",
        element: (
          <UserProvider>
            <AdminLayout />
          </UserProvider>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "informacije",
            element: <AdminInformations />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
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
