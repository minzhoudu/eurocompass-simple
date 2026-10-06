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
