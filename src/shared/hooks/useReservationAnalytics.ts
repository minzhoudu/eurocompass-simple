import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { ReservationAnalytics } from "../models";

// Booking statistics for a travel-date range (inclusive). The previous data
// stays on screen while a new range loads, so the charts don't jump.
export const useReservationAnalytics = (from: string, to: string) =>
  useQuery({
    queryKey: ["reservations", "analytics", from, to],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ReservationAnalytics>(
        "/reservations/analytics",
        { params: { from, to } },
      );

      return data;
    },
    enabled: !!from && !!to && from <= to,
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  });
