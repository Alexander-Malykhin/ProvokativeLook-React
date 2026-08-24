export const formatReviewDate = (date: string): string => {
  if (!date) {
    return "";
  }

  const [day, month, year] = date.split(".").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return parsedDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
