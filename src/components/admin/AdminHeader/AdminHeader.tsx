import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../../../config/axiosInstance";
import { useUserContext } from "../../../contexts";

export const AdminHeader = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await axios.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/admin");
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <div className="flex h-[5%] items-center justify-between bg-gray-800 px-10 text-lg font-bold text-white">
      <Link to="/admin/dashboard">
        {user?.firstName} {user?.lastName}
      </Link>

      <ul className="flex h-full gap-5">
        <li className="h-full">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              isActive
                ? "flex h-full items-center text-primaryYellow"
                : "flex h-full items-center"
            }
          >
            Početna
          </NavLink>
        </li>

        <li className="h-full">
          <NavLink
            to="/admin/dashboard/informacije"
            className={({ isActive }) =>
              isActive
                ? "flex h-full items-center text-primaryYellow"
                : "flex h-full items-center"
            }
          >
            Informacije
          </NavLink>
        </li>

        <li className="h-full">
          <button className="flex h-full items-center" onClick={handleLogout}>
            Izloguj se
          </button>
        </li>
      </ul>
    </div>
  );
};
