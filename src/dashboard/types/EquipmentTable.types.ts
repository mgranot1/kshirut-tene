import { Kshirut } from "../../shared/types/params.types";
import { DashboardFault } from "./FaultTable.types";

export type DashboardEquipmentRow = {
  equipment: string;
  description: string;
  kshirut: Kshirut;
  warKshirut: Kshirut;
  warTplnr: string;
  conclusiveWarTplnr:string;
  conclusiveWarTplnrDesc:string;
  routineTplnr: string;
  routineTplnrDesc: string;
  warTplnrDesc: string;
  isGdudManeuvering: boolean;
  material: string;
  materialFamily: string;
  materialFamilyDesc: string;
  mainPlatform: string;
  mainPlatformDesc: string;
  secPlatform: string;
  secPlatformDesc: string;
  isAgamForce: boolean;
  excFromWar: boolean;
  isLogisticForce: boolean;
  physicalLocation: string;
  physicalLocationDetails: string;
  pikud: string;
  pikudDesc: string;
  ugda: string;
  ugdaDesc: string;
  utzva: string;
  utzvaDesc: string;
  pluga: string;
  job: string;
  lastUpdateTimestamp?: Date;
  openFaults: number;
  maamad: string;
  maamadDesc: string;
  purpose: string;
  purposeDesc: string;
  equipmentTask: string;
  decidingNonKshirutCause: string;
  tags: string[];
};

export type DashboardEquipment = Omit<DashboardEquipmentRow, "openFaults"> & {
  faults: DashboardFault[];
};

