import { calcKshirutPercent } from "./kshirut.utils";

export const getGraphColor = (
  amountAll: number,
  amountNotKashir: number,
  toWarningThreshold: number = 80,
  toSevereThreshold: number = 59,

) => {
  const percent = calcKshirutPercent(
    amountAll,
    amountNotKashir
  );
  if (amountAll === 0 && amountNotKashir === 0) {
    return "#000000"; // Black
  }

  switch (true) {
    case percent < toSevereThreshold:
      return "#F14D29";
    case percent < toWarningThreshold:
      return "#FF9501";
    case percent < 100:
      return "#3EB869";
    default:
      return "#3EB869";
  }
};