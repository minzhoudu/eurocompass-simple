import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { PaginatedReservations } from "../models";

type UseReservationsParams = {
  page: number;
  search: string;
};

export const useReservations = ({ page, search }: UseReservationsParams) =>
  useQuery({
    queryKey: ["reservations", { page, search }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaginatedReservations>(
        "/reservations",
        { params: { page, search: search || undefined } },
      );
      return data;
    },
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });
