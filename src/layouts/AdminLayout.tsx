import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components";

export const AdminLayout = () => {
  return (
    <div className="h-screen">
      <AdminHeader />

      <Outlet />
    </div>
  );
};
