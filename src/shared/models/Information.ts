export type Information = {
  id: number;
  regularPrice: string;
  roundtripPrice: string;
  importantInfo: string[];
};

export type InformationResponse = {
  message: string;
  info: Information | null;
};
