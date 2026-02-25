import {
  ExpandedExpectedTime,
  FaultStatus,
} from "../../shared/types/params.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";

export const expectedTimeIsLessThan = (
  a: ExpandedExpectedTime,
  b: ExpandedExpectedTime
): boolean => {
  if (a === ExpandedExpectedTime.None) return true;
  if (b === ExpandedExpectedTime.None) return false;
  if (a === ExpandedExpectedTime.Unknown) return false;
  if (b === ExpandedExpectedTime.Unknown) return true;

  return a < b;
};

export const extractExpectedTimeToExpand = (
  equipment: GeneralDashboardTableRow
): ExpandedExpectedTime => {
  return !equipment.expectedTime
    ? ExpandedExpectedTime.Unknown
    : equipment.faultStatus === FaultStatus.Done
      ? ExpandedExpectedTime.None
      : equipment.expectedTime;
};
