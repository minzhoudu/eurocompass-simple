// Serbian plural: 1 / 21 -> one, 2-4 / 22-24 -> few, everything else -> many.
export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string,
) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) return one;
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return few;
  }

  return many;
};
