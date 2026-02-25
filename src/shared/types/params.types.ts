export enum PhysicalLocation {
  InOurTerritory = "01",
  CombatSpace = "02",
  Eged = "03",
  Masha = "04",
  Industries = "05",
  OperationalYamah = "06",
}

export enum FaultStatus {
  Opened = "01",
  InWork = "02",
  MovedToHighRank = "03",
  WaitingForParts = "04",
  WaitingForRecovery = "05",
  WaitingForSquad = "06",
  WaitingForMaintenance = "07",
  WaitingForTransportation = "08",
  Done = "09",
  Cancelled = "10",
}

export enum FaultMobileAbility {
  IndependentMobilty = "01",
  NonIndependentMobilty = "02",
}

export enum TransportationType {
  WinchRequired = "1",
}

export enum GrindType {
  Technical = "01",
  Operational = "02",
}

export enum ExpectedTime {
  LessThan6 = "01",
  LessThan12 = "02",
  LessThan24 = "03",
  LessThan48 = "04",
  LessThan72 = "05",
  MoreThan72 = "06",
  OutOfWar = "07",
}

export enum MaxExpectedTime {
  None = "00",
  Unknown = "10",
}

export const ExpandedExpectedTime = { ...ExpectedTime, ...MaxExpectedTime };
export type ExpandedExpectedTime =
  (typeof ExpandedExpectedTime)[keyof typeof ExpandedExpectedTime];

export enum Kshirut {
  Empty = "",
  Kashir = "01",
  Not_Kashir = "02",
  Not_relevant = "03",
}

export const CLOSED_FAULT_STATUSES: FaultStatus[] = [
  FaultStatus.Done,
  FaultStatus.Cancelled,
];

export const PHYSICAL_LOCATIONS_IN_OUR_AREA: PhysicalLocation[] = [
  PhysicalLocation.InOurTerritory,
  PhysicalLocation.Eged,
  PhysicalLocation.Masha,
  PhysicalLocation.Industries,
  PhysicalLocation.OperationalYamah,
];
export type ParamKey =
  | "expectedTime"
  | "grindType"
  | "dereg"
  | "physicalLocation"
  | "mobileAbility"
  | "faultStatus"
  | "kshirut"
  | "availabilityInhibitor"
  | "reqSquad"
  | "transportationType"
  | "equipmentTask"
  | "decidingNonKshirutCause"
  | "tags"
  | "missingPartStatus"
  | "maamad"
  | "purpose";

export const paramsKey: Record<ParamKey, string> = {
  expectedTime: "PM_EXPECTED_TIME_D",
  grindType: "PM_GRIND_D",
  dereg: "PM_KSH_DEREG_D",
  physicalLocation: "PM_KSH_PH_LOCATION_D",
  mobileAbility: "PM_KSH_ABILITY_MOBILE_D",
  faultStatus: "PM_KSH_FAULT_STATUS_D",
  kshirut: "PM_KSH_KSHIRUT",
  availabilityInhibitor: "PM_SYS_D",
  reqSquad: "PM_REQ_SQUAD_D",
  transportationType: "PM_KSH_TRANSPORT_TYPE_D",
  decidingNonKshirutCause: "PM_DCD_NON_KSH_CAUSE",
  equipmentTask: "PM_EQUIPMENT_TASK",
  tags: "PM_TAG",
  missingPartStatus: "PM_MISSING_PARTS",
  maamad: "MAAMAD",
  purpose: "PURPOSE",
};
