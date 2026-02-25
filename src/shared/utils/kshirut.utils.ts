import { KshirutType } from "../../dashboard/stores/kshirutType.store";
import { Kshirut } from "../types/params.types";
import { calcPercent } from "./percentage.util";

export type EquipmentKshirutFields = {
  isGdudManeuvering: boolean;
  kshirut: Kshirut;
  warKshirut: Kshirut;
};

export const isEquipmentNotKashir = <E extends EquipmentKshirutFields>(
  equipment: E,
  kshirutTypeToCheck: KshirutType
) => {
  return kshirutTypeToCheck === KshirutType.Routine
    ? equipment.kshirut === Kshirut.Not_Kashir
    : equipment.warKshirut === Kshirut.Not_Kashir;
};

export const calcKshirutPercent = (
  amountAll: number,
  amountNotKashir: number
): number => {
  const total = amountAll === 0 ? 1 : amountAll;

  return calcPercent(amountAll - amountNotKashir, total);
};
