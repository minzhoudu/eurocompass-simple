import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { ReservationStats } from "../models";

export const useReservationStats = () =>
  useQuery({
    queryKey: ["reservationStats"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<ReservationStats>("/reservations/stats");
      return data;
    },
    staleTime: 1000 * 60,
  });
