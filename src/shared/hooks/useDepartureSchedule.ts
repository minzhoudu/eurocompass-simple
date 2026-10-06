import { useMemo } from "react";

import { DEFAULT_SCHEDULE, DepartureSchedule } from "../components/forms/utils";
import { useInformation } from "./useInformation";

type UseDepartureScheduleOptions = {
  staleTime?: number;
};

// The departure times configured in the admin, falling back to the built-in
// defaults until they load (or if none are saved yet).
export const useDepartureSchedule = (
  options: UseDepartureScheduleOptions = {},
) => {
  const { data, ...query } = useInformation(options);
  const info = data?.info;

  const schedule = useMemo<DepartureSchedule>(
    () =>
      info
        ? {
            krusevac: info.startingTimesKrusevac ?? [],
            beograd: info.startingTimesBeograd ?? [],
            beogradSunday: info.saturdayBeograd ?? [],
          }
        : DEFAULT_SCHEDULE,
    [info],
  );

  return { schedule, ...query };
};
