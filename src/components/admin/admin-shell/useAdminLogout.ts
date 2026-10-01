import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import axiosInstance, { setAccessToken } from "../../../config/axiosInstance";

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        await axiosInstance.post("/auth/logout");
      } finally {
        setAccessToken(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/admin");
    },
  });

  return { logout: () => mutate(), isLoggingOut: isPending };
};
