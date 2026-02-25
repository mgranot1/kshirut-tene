import { MaterialTypes } from "../../shared/types/mean.types";
import {
  ExpandedExpectedTime,
  ExpectedTime,
} from "../../shared/types/params.types";

export type DashboardFault = {
  faultNum: string;
  faultStatus: string;
  essence: string;
  equipment: string;
  expectedTime: ExpectedTime | ExpandedExpectedTime;
  contact: string;
  phoneNumber: string;
  dereg: string;
  squad: string;
  mobileAbility: string;
  reqSquad: string;
  note: string;
  grindType: string;
  availabilityInhibitor: string;
  physicalLocation: string;
  physicalLocationDetails: string;
  faultHh: DashboardFaultMaterial[];
  faultEmz: DashboardFaultMaterial[];
  transportationType: string;
  faultHhProblem: DashboardFaultMaterial[];
  faultEmzProblem: DashboardFaultMaterial[];
  createTimestamp?: Date;
  changeTimestamp?: Date;
};

export type DashboardFaultMaterial = {
  material: string;
  materialDesc: string;
  sequenceNumber: string;
  missingParts: MaterialTypes;
  quantity: number;
  isValid: string;
};
