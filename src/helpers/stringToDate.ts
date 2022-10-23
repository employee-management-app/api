export const stringToDate = (stringDate: string | undefined, suffix = '-') => {
  if (!stringDate) {
    return null;
  }

  const [year, month, day] =
    stringDate
      .split(suffix)
      .reverse()
      .map((str, index) => index === 1 ? Number(str) - 1 : Number(str));

  return new Date(year, month, day);
};
