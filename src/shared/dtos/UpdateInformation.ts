export type UpdateInformationDto = {
  id: number;
  regularPrice?: string;
  roundtripPrice?: string;
  studentPrice?: string;
  importantInfo?: string[];
  startingTimesKrusevac?: string[];
  startingTimesBeograd?: string[];
  saturdayBeograd?: string[];
};
