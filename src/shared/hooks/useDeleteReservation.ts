import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReservation"],
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/reservations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservationStats"] });
    },
  });
};
