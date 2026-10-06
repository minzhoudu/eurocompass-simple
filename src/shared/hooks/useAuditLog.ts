import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import {
  AuditLogFilters,
  DEFAULT_AUDIT_LOG_FILTERS,
  PaginatedAuditLog,
} from "../models";

type UseAuditLogParams = {
  page: number;
  search: string;
  filters?: AuditLogFilters;
  refetchInterval?: number | false;
};

export const useAuditLog = ({
  page,
  search,
  filters = DEFAULT_AUDIT_LOG_FILTERS,
  refetchInterval = false,
}: UseAuditLogParams) =>
  useQuery({
    queryKey: ["audit-log", { page, search, filters }],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PaginatedAuditLog>(
        "/audit-log",
        {
          // Empty values are left out so the backend applies no filter.
          params: {
            page,
            search: search || undefined,
            entityType: filters.entityType || undefined,
            actor: filters.actor || undefined,
            from: filters.from || undefined,
            to: filters.to || undefined,
          },
        },
      );
      return data;
    },
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
    refetchInterval,
    // Nothing to retry: an error here is a missing table or a bad session.
    retry: false,
  });
