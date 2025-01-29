import { useMutation, useQuery } from "@tanstack/react-query";

import axiosInstance from "../../../config/axiosInstance";
import { InformationResponse, UpdateInformationDto } from "../../../shared";
import { StartingTime, StartingTimeId } from "./components";

export const AdminDashboard = () => {
  const { data, refetch: refetchInfo } = useQuery({
    queryKey: ["information"],
    queryFn: async () => {
      const { data } =
        await axiosInstance.get<InformationResponse>("/information");
      return data;
    },
  });

  const {
    mutate,
    isError: isDeleteError,
    isPending,
  } = useMutation({
    mutationKey: ["updateInformation"],
    mutationFn: async (updatedInfo: UpdateInformationDto) => {
      await axiosInstance.patch("/information", updatedInfo);
    },
    onSuccess: () => {
      refetchInfo();
    },
  });

  const handleDeleteTime = (id: StartingTimeId, time: string) => {
    if (!data || !data.info) return;

    if (id === "krusevac") {
      const startingTimesKrusevac = data?.info?.startingTimesKrusevac.filter(
        (startingTime) => startingTime.trim() !== time.trim(),
      );

      mutate({
        id: data.info.id,
        startingTimesKrusevac,
      });
    }

    if (id === "beograd") {
      const startingTimesBeograd = data?.info?.startingTimesBeograd.filter(
        (startingTime) => startingTime.trim() !== time.trim(),
      );

      mutate({
        id: data.info.id,
        startingTimesBeograd,
      });
    }
  };

  const handleAddTime = (id: StartingTimeId, time: string) => {
    if (!data || !data.info) return;

    if (id === "krusevac") {
      const startingTimesKrusevac = [...data.info.startingTimesKrusevac, time];

      mutate({
        id: data.info.id,
        startingTimesKrusevac,
      });
    }

    if (id === "beograd") {
      const startingTimesBeograd = [...data.info.startingTimesBeograd, time];

      mutate({
        id: data.info.id,
        startingTimesBeograd,
      });
    }
  };

  return (
    <div className="flex h-[95%] w-full flex-col items-center justify-center gap-5 bg-gray-400">
      <div className="rounded-md bg-primaryBlue px-4 py-2">
        <h1 className="text-2xl font-semibold text-white">
          Eurocompass Admin Panel
        </h1>
      </div>

      <div className="flex gap-36">
        <StartingTime
          id="krusevac"
          title="Polazna vremena Kruševac"
          times={data?.info?.startingTimesKrusevac}
          handleDeleteTime={handleDeleteTime}
          handleAddTime={handleAddTime}
          isLoading={isPending}
        />

        <StartingTime
          id="beograd"
          title="Polazna vremena Beograd"
          times={data?.info?.startingTimesBeograd}
          handleDeleteTime={handleDeleteTime}
          handleAddTime={handleAddTime}
          isLoading={isPending}
        />
      </div>

      {isDeleteError && (
        <p className="font-bold text-red-600">
          Došlo je do greške, pokušajte ponovo ili kontaktirajte podršku!
        </p>
      )}
    </div>
  );
};
