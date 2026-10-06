import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import {
  DEFAULT_RESERVATION_FILTERS,
  PaginatedReservations,
  ReservationFilters,
} from "../models";

type UseReservationsParams = {
  page: number;
  search: string;
  filters?: ReservationFilters;
  refetchInterval?: number | false;
};

export const useReservations = ({
  page,
  search,
  filters = DEFAULT_RESERVATION_FILTERS,
  refetchInterval = false,
}: UseReservationsParams) =>
  useQuery({
    queryKey: ["reservations", { page, search, filters }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaginatedReservations>(
        "/reservations",
        {
          // Empty values are left out so the backend applies no filter.
          params: {
            page,
            search: search || undefined,
            travelFrom: filters.travelFrom || undefined,
            travelTo: filters.travelTo || undefined,
            location: filters.location || undefined,
            time: filters.time || undefined,
            duplicatesOnly: filters.duplicatesOnly || undefined,
            sort:
              filters.sort === DEFAULT_RESERVATION_FILTERS.sort
                ? undefined
                : filters.sort,
          },
        },
      );
      return data;
    },
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
    refetchInterval,
  });
