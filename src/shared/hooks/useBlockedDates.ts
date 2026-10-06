import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { SaveBlockedDateDto } from "../dtos";
import { BlockedDate } from "../models";

const UPCOMING_KEY = ["blockedDates", "upcoming"];
const LATEST_TIMEOUT_MS = 6000;

const fetchUpcoming = async (timeout?: number) => {
  const { data } = await axiosInstance.get<BlockedDate[]>(
    "/blocked-dates/upcoming",
    { timeout },
  );

  return data;
};

// Public: blocks the booking form must respect. If the request fails the form
// simply behaves as if nothing is blocked (the backend still checks too).
export const useBlockedDates = () => {
  const { data, ...query } = useQuery({
    queryKey: UPCOMING_KEY,
    queryFn: () => fetchUpcoming(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { blockedDates: data ?? [], ...query };
};

// Used right before a booking is sent: refreshes the blocks so a page that has
// been open for a while can't book a day that was blocked in the meantime.
// Gives up quickly (and falls back to what is cached) rather than holding up
// the customer if the backend is slow or down.
export const useFetchLatestBlockedDates = () => {
  const queryClient = useQueryClient();

  return async (fallback: BlockedDate[]) => {
    try {
      return await queryClient.fetchQuery({
        queryKey: UPCOMING_KEY,
        queryFn: () => fetchUpcoming(LATEST_TIMEOUT_MS),
        staleTime: 0,
      });
    } catch {
      return fallback;
    }
  };
};

// Admin: every block, including past ones.
export const useAllBlockedDates = () =>
  useQuery({
    queryKey: ["blockedDates", "all"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<BlockedDate[]>("/blocked-dates");

      return data;
    },
    staleTime: 0,
  });

type SaveBlockedDateVariables = {
  // Omit to create a new block.
  id?: number;
  blockedDate: SaveBlockedDateDto;
};

export const useSaveBlockedDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveBlockedDate"],
    mutationFn: async ({ id, blockedDate }: SaveBlockedDateVariables) => {
      const { data } =
        id === undefined
          ? await axiosInstance.post<BlockedDate>("/blocked-dates", blockedDate)
          : await axiosInstance.put<BlockedDate>(
              `/blocked-dates/${id}`,
              blockedDate,
            );

      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blockedDates"] }),
  });
};

export const useDeleteBlockedDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteBlockedDate"],
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/blocked-dates/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["blockedDates"] }),
  });
};
