import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { SaveNoticeDto } from "../dtos";
import { Notice, PublicNotice } from "../models";

// Public: notices that should be visible on the site right now.
export const useActiveNotices = () =>
  useQuery({
    queryKey: ["notices", "active"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<PublicNotice[]>("/notices/active");
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

// Admin: every notice, including scheduled, expired and disabled ones.
export const useNotices = () =>
  useQuery({
    queryKey: ["notices", "all"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Notice[]>("/notices");
      return data;
    },
    staleTime: 0,
  });

type SaveNoticeVariables = {
  // Omit to create a new notice.
  id?: number;
  notice: SaveNoticeDto;
};

export const useSaveNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveNotice"],
    mutationFn: async ({ id, notice }: SaveNoticeVariables) => {
      const { data } =
        id === undefined
          ? await axiosInstance.post<Notice>("/notices", notice)
          : await axiosInstance.put<Notice>(`/notices/${id}`, notice);

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteNotice"],
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/notices/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }),
  });
};
