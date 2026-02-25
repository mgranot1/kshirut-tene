import { ServerKeyValue } from "../../shared/types/general.types";
import { KshirutType } from "../stores/kshirutType.store";
import { SelectableFilter } from "./componentFilter.types";
import { IVariant } from "./variant.types";

export type FetchTopViewPayload = {
  operation: string;
  funclocOrObjid: string;
  kshirutType: KshirutType;
  filters: SelectableFilter[];
  variantId?: IVariant["variantId"];
};

export type KshirutAmount = {
  totalEquipmentsCount: number;
  kashirEquipmentsCount: number;
};

export interface KshirutByFamily {
  code: string;
  title: string;
  total: number;
  kshirim: number;
}

export interface FetchTopViewData {
  cacheKey: string;
  agamKshirutAmount: number;
  agamKshirutTotal: number;
  logisticKshirutAmount: number;
  logisticKshirutTotal: number;
  technicalGrinds: number;
  grindFaultsCount: number;
  operationalGrinds: number;
  squadAwaitingFaultsCount: number;
  squadAwaitingEquipsCount: number;
  recoveryAwaitingFaultsCount: number;
  recoveryAwaitingEquipsCount: number;
  transportAwaitingFaultCount: number;
  transportAwaitingEquipCount: number;
  winchRequiredEquipsCount: number;
  missingHhsCount: number;
  equipmentsWithMissingCount: number;
  invalidMissingHhsCount: number;
  malfunEquipInOurAreaCount: number;
  malfunEquipInEgedCount: number;
  malfunEquipInMashaCount: number;
  malfunEquipInIndustrCount: number;
  malfunEquipInYamahCount: number;
  malfuncEquipsInWar: number;
  malfunEqIndependMobilCount: number;
  faultsInOurAreaCount: number;
  faultsInWarCount: number;
  kshirutByFamily: KshirutByFamily[];
  "24KashirEquipmentsCountPie": number;
  "48KashirEquipmentsCountPie": number;
  "72KashirEquipmentsCountPie": number;
  totalEquipmentsCountPie: number;
  rnKashirEquipmentsCountPie: number;
}

export interface KPIData {
  cacheKey: string;
  agamKshirutPercentage: string | number;
  agamKshirutAmount: number;
  agamKshirutTotal: number;
  logisticKshirutPercentage: string | number;
  logisticKshirutAmount: number;
  logisticKshirutTotal: number;
  malfunctionedEquipmentsInOurArea: TitleValuePair<number>[];
  malfunctionedEquipmentsInWar: TitleValuePair<number>[];
  technicalGrinds: number;
  grindFaultsCount: number;
  grindEquipmentsCount: number;
  operationalGrinds: number;
  squadAwaitingFaultsCount: number;
  squadAwaitingEquipmentsCount: number;
  recoveryAwaitingFaultsCount: number;
  recoveryAwaitingEquipmentsCount: number;
  transportAwaitingFaultCount: number;
  transportAwaitingEquipmentCount: number;
  WinchRequiredEquipmentsCount: number;
  materialsCount: number;
  equipmentsWithMissingCount: number;
  invalidHHsCount: number;
  kshirutByFamily: KshirutByFamily[];
  "24KashirEquipmentsCountPie": number;
  "48KashirEquipmentsCountPie": number;
  "72KashirEquipmentsCountPie": number;
  totalEquipmentsCountPie: number;
  rnKashirEquipmentsCountPie: number;
}

export type TitleValuePair<T> = {
  title: string;
  subtitle?: string;
  value: T;
  valueDesc?: string;
};

export type GdudFilters = Pick<
  TopViewDynamicFilters,
  "routineGdudFilters" | "warGdudFilters"
>;

export type TopViewDynamicFilters = {
  routineGdudFilters: ServerKeyValue[];
  warGdudFilters: ServerKeyValue[];
};
