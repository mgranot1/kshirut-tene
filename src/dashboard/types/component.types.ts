import { FilterType, IComponentFilter } from "./componentFilter.types";
import { OrganizationalLevel } from "./dashboardOrgLevel.types";
import { IDashboardFiltersValue } from "./filters.types";
import { IScreen } from "./screen.types";

export type TComponentFilters = {
  [key in FilterType]: string;
};

export type GraphDataMap = {
  [ComponentType.Pie]: PieData;
  [ComponentType.PieWithExpected]: PieWithExpectedData;
};

export type IBaseComponent = {
  id: string;
  compColumn: number;
  compRow: number;
  screenId: IScreen["id"];
  type: ComponentType;
};

export type TComponentLocation = {
  id: string;
  compColumn: number;
  compRow: number;
  deletionFlag: boolean;
};

export type IComponent = IBaseComponent & {
  name: string;
  toWarningThreshold: number;
  toSevereThreshold: number;
  // changeTimestamp: Date;
};

export interface IExpandedComponent extends IComponent {
  kshirutData: PieData | PieWithExpectedData;
}

export type TComponentSetting = {
  id: IComponent["id"];
  name: string;
  type: ComponentType;
  compColumn: number;
  compRow: number;
  orgLevel: OrganizationalLevel;
  filters: IDashboardFiltersValue<TComponentFilters>[];
  rangePercent: RangePercent;
};

export type RangePercent = {
  toSevereThreshold: IComponent["toSevereThreshold"];
  toWarningThreshold: IComponent["toWarningThreshold"];
};

export type TComponentHeader = IComponent & {
  filters: IComponentFilter[];
};

export type TCompMeta = TComponentLocation;

export type TComponentToSAP = {
  id: IScreen["id"];
  compHeader: TComponentHeader[];
  compMeta: TCompMeta[];
};

export enum ComponentType {
  Pie = "01",
  PieWithExpected = "02",
}

export type TComponentData<T extends ComponentType> = {
  id: IComponent["id"];
  name: IComponent["name"];
  type: T;
  toSevereThreshold: IComponent["toSevereThreshold"];
  toWarningThreshold: IComponent["toWarningThreshold"];
  componentData: GraphDataMap[T];
};

export type PieData = {
  kashir: number;
  total: number;
};

export type PieWithExpectedData = {
  kashir: number;
  total: number;
  kashirOn24: number;
  kashirOn48: number;
  kashirOn72: number;
};
