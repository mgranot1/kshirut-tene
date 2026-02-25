export function convertDateToTimeDisplay(timestamp: Date) {
  return (
    String(timestamp.getHours()).padStart(2, "0") +
    ":" +
    String(timestamp.getMinutes()).padStart(2, "0")
  );
}

export function areDatesEqual(date1: Date, date2: Date): boolean {
  const dateA = new Date(date1);
  dateA.setHours(0, 0, 0, 0);

  const dateB = new Date(date2);
  dateB.setHours(0, 0, 0, 0);

  return +dateA === +dateB;
}

export const compareTimestamps = (
  dateA: Date | undefined,
  dateB: Date | undefined
) => {
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;
  if (!dateB) return -1;

  return new Date(dateA).getTime() - new Date(dateB).getTime() > 0 ? 1 : -1;
};
export const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
}
