import { IComponent } from "./component.types";
import { OrgLevelCode } from "./dashboardOrgLevel.types";
import { IOptionVal } from "./filters.types";

export const FilterOrgLevel = {
  [OrgLevelCode.TREE_TYPE]: "09",
  [OrgLevelCode.PIKUD]: "10",
  [OrgLevelCode.UGDA]: "11",
  [OrgLevelCode.UTZVA]: "12",
  [OrgLevelCode.GDUD]: "13",
};

export enum FilterType {
  MaterialFamily = "01",
  MainPlatform = "02",
  SecPlatform = "03",
  Tags = "04",
  DecidingNonKshirutCause = "05",
  AvailabilityInhibitor = "06",
  PhysicalLocation = "07",
  EquipmentTask = "08",
  Kshirut = "14",
  WarKshirut = "15",
  IsGdudManeuvering = "16",
  Maamad = "17",
  Purpose = "18",
  WarTplnr = "19",
  RoutineTplnr = "20",
  IsAgamForce = "21",
  IsLogisticForce = "22",
  Job = "23",
  Pluga = "24",
  Equipment = "25",
  LastUpdateTimestamp = "26",
  FaultNum = "27",
  Essence = "28",
  CreateTimestamp = "29",
  ChangeTimestamp = "30", // fault or equip?
  ExpectedTime = "31",
  FaultStatus = "32",
  Dereg = "33",
  GrindType = "34",
  MobileAbility = "35",
  FaultHh = "36",
  ReqSquad = "37",
  Squad = "38",
  PhysicalLocationDetails = "39",
  Contact = "40",
  PhoneNumber = "41",
  Note = "42",
  Material = "43",
  TreeType = "09",
  Pikud = "10",
  Ugda = "11",
  Utzva = "12",
}

export interface IComponentFilter extends SelectableFilter {
  id: string;
  componentId: IComponent["id"];
}

export interface SelectableFilter {
  field: FilterType;
  value: IOptionVal["value"];
}
