import { FaultStatus } from "../../shared/types/params.types";

export interface ISummaryFault {
  changeTimestamp: Date;
  faultNum: string;
  faultStatus: FaultStatus;
  essence: string;
  equipment: string;
  isValid: boolean;
}
