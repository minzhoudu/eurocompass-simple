import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../config/axiosInstance";
import { InformationResponse } from "../models";

type UseInformationOptions = {
  staleTime?: number;
};

export const useInformation = ({
  staleTime = 1000 * 60 * 60,
}: UseInformationOptions = {}) =>
  useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<InformationResponse>("/information");
      return data;
    },
    staleTime,
  });
