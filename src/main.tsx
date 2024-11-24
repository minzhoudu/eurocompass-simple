import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";

import { AppLayout } from "./layouts";
import { ErrorPage, HomePage, Informations, Reservations } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "rezervacije",
        element: <Reservations />,
        errorElement: <ErrorPage />,
      },
      {
        path: "informacije",
        element: <Informations />,
        errorElement: <ErrorPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="font-sans">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>,
);
