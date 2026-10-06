import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { DEFAULT_RESERVATION_FILTERS, ReservationFilters } from "../models";
import { downloadBlob } from "../utils";

type ExportReservationsParams = {
  search?: string;
  filters?: ReservationFilters;
  filename: string;
};

// Downloads every reservation matching the search and filters as a CSV. It is
// fetched with the auth header (a plain link could not send it) and then saved.
export const useExportReservations = () =>
  useMutation({
    mutationKey: ["exportReservations"],
    mutationFn: async ({
      search = "",
      filters = DEFAULT_RESERVATION_FILTERS,
      filename,
    }: ExportReservationsParams) => {
      const { data } = await axiosInstance.get<Blob>("/reservations/export", {
        responseType: "blob",
        // Can be slow on a cold backend and covers every matching row.
        timeout: 60_000,
        params: {
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
      });

      downloadBlob(
        new Blob([data], { type: "text/csv;charset=utf-8" }),
        filename,
      );
    },
  });
