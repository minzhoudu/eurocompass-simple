import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { CreateAdminUserDto, UpdateAdminUserDto } from "../dtos";
import { AdminUser } from "../models";

// Owner only. Everything here also changes what the audit log shows.
const refreshUsersAndAudit = (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    queryClient.invalidateQueries({ queryKey: ["audit-log"] }),
  ]);

export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AdminUser[]>("/users");
      return data;
    },
    staleTime: 0,
    retry: false,
  });

type SaveAdminUserVariables =
  | { id?: undefined; user: CreateAdminUserDto }
  | { id: number; user: UpdateAdminUserDto };

export const useSaveAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveAdminUser"],
    mutationFn: async ({ id, user }: SaveAdminUserVariables) => {
      const { data } =
        id === undefined
          ? await axiosInstance.post<AdminUser>("/users", user)
          : await axiosInstance.patch<AdminUser>(`/users/${id}`, user);

      return data;
    },
    onSuccess: () => refreshUsersAndAudit(queryClient),
  });
};

export const useResetAdminPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["resetAdminPassword"],
    mutationFn: async ({ id, password }: { id: number; password: string }) => {
      await axiosInstance.post(`/users/${id}/password`, { password });
    },
    onSuccess: () => refreshUsersAndAudit(queryClient),
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteAdminUser"],
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/users/${id}`);
    },
    onSuccess: () => refreshUsersAndAudit(queryClient),
  });
};
