// "YYYY-MM-DD" shifted by whole days (local calendar, DST-safe).
export const addDays = (date: string, days: number) => {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(year, month - 1, day + days);
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`;
};
