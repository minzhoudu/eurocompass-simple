export type SaveBlockedDateDto = {
  startsOn: string;
  // null = the same day as startsOn.
  endsOn: string | null;
  city: string | null;
  time: string | null;
  reason: string | null;
};
