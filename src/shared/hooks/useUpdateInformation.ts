import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { UpdateInformationDto } from "../dtos";
import { InformationResponse } from "../models";

export const useUpdateInformation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateInformation"],
    mutationFn: async (updatedInfo: UpdateInformationDto) => {
      const { data } = await axiosInstance.patch<InformationResponse>(
        "/information",
        updatedInfo,
      );

      if (!data.info) throw new Error(data.message);

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["information"], data);
    },
  });
};
