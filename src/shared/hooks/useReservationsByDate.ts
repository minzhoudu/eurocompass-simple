import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { DepartureReservation } from "../models";

// Keyed under "reservations" so deleting a reservation refreshes this too.
export const useReservationsByDate = (
  date: string,
  refetchInterval: number | false = false,
) =>
  useQuery({
    queryKey: ["reservations", "by-date", date],
    queryFn: async () => {
      const { data } = await axiosInstance.get<DepartureReservation[]>(
        "/reservations/by-date",
        { params: { date } },
      );
      return data;
    },
    staleTime: 1000 * 30,
    refetchInterval,
  });
