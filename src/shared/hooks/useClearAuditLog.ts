import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";

// Owner only. `olderThanDays: null` clears the whole history.
export const useClearAuditLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["clearAuditLog"],
    mutationFn: async (olderThanDays: number | null) => {
      const { data } = await axiosInstance.delete<{ deletedCount: number }>(
        "/audit-log",
        {
          params: olderThanDays === null ? { all: true } : { olderThanDays },
        },
      );

      return data.deletedCount;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-log"] }),
  });
};

// Owner only. The server keeps a trace of what was removed.
export const useDeleteAuditEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteAuditEntry"],
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/audit-log/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["audit-log"] }),
  });
};
