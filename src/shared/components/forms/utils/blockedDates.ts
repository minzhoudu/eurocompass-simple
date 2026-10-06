import { BlockedDate } from "../../../models";

const covers = (block: BlockedDate, date: string) =>
  block.startsOn <= date && date <= block.endsOn;

// A city-specific block only applies once that city is known.
const matchesCity = (block: BlockedDate, city: string) =>
  block.city === null ||
  (city !== "" && block.city.toLowerCase() === city.toLowerCase());

// A block that cancels the whole day (every departure) for this city.
export const findDayBlock = (
  blockedDates: BlockedDate[],
  date: string,
  city: string,
) =>
  blockedDates.find(
    (block) =>
      block.time === null && covers(block, date) && matchesCity(block, city),
  );

// Any block (whole day or this exact departure) that stops this departure.
export const findDepartureBlock = (
  blockedDates: BlockedDate[],
  date: string,
  city: string,
  time: string,
) =>
  blockedDates.find(
    (block) =>
      (block.time === null || block.time === time) &&
      covers(block, date) &&
      matchesCity(block, city),
  );

export const getDayBlockMessage = (block: BlockedDate) =>
  block.reason
    ? `Na izabrani datum nema polazaka: ${block.reason}`
    : "Na izabrani datum nema polazaka.";

export const getDepartureBlockMessage = (block: BlockedDate, time: string) =>
  block.reason
    ? `Polazak u ${time} ne saobraća: ${block.reason}`
    : `Polazak u ${time} tog dana ne saobraća.`;

// "Beograd: svi polasci" / "Oba grada: polazak u 07:00"
export const getBlockScopeText = ({ city, time }: BlockedDate) => {
  const place = city ?? "Oba grada";

  return time ? `${place}: polazak u ${time}` : `${place}: svi polasci`;
};
