import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { Reservation } from "../models";

export const useReservations = () =>
  useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<Reservation[]>("/reservations");
      return data;
    },
    staleTime: 1000 * 60,
  });
