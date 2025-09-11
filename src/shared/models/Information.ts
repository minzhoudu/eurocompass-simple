export type Information = {
  id: number;
  regularPrice: string;
  roundtripPrice: string;
  studentPrice: string;
  importantInfo: string[];
  startingTimesKrusevac: string[];
  startingTimesBeograd: string[];
  saturdayBeograd: string[];
};

export type InformationResponse = {
  message: string;
  info: Information | null;
};
