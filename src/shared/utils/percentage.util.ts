export const calcPercent = (curr: number, total: number) => {
  if (curr == undefined || total == undefined) return 0;
  if (total <= 0 || curr <= 0) return 0;

  const ratio = curr / total;
  if (ratio < 0.01) return 1;
  if (ratio == 1) return 100;
  if (ratio > 0.99) return 99;
  return Math.round(ratio * 100);
};
