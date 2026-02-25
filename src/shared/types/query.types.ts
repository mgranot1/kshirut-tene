import {
  DefaultError,
  UseMutationOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export enum QueryKeys {
  GetFaultData = "getFaultData",
  GetZadikData = "getZadikData",
  GetZadikQuery = "getZadikQuery",
  GetZadiksData = "getZadiksData",
  GetKshirutData = "getKshirutData",
  GetIsManeuveringGdud = "getIsManeuveringGdud",
  GetTags = "getTags",
  GetLogs = "getLogs",
  GetFamilies = "getFamilies",
  GetTsavIrgun = "getTsavIrgun",
  GetTagOptions = "getTagOptions",
  GetTsavIrgunEmergency = "getTsavIrgunEmergency",
  GetCurrentUserUnit = "getCurrentUserUnit",
  GetEmergencyGduds = "getEmergencyGduds",
  GetHHDescriptions = "getHHDescriptions",
  GetChatByFault = "getChatByFault",
  GetOperations = "getOperations",
  GetSummaryFaultsByEquipment = "getSummaryFaultsByEquipment",
  GetHHDescriptionByMaterial = "getHHDescriptionByMaterial",
  GetMissingHHData = "getMissingHHData",
  GetTopViewData = "getTopViewData",
  UpdateView = "updateView",
  UpdateFault = "updateFault",
  UpdateKshirutData = "updateKshirutData",
  UpdateIsManeuveringGdud = "updateIsManeuveringGdud",
  GetComponentSetting = "getComponentSetting",
  GetComponentData = "getComponentData",
  GetScreenComponents = "getScreenComponents",
  GetScreens = "getScreens",
  UpsertScreen = "useUpsertScreen",
  GetSplitComponent = "getSplitComponent",
  GetVariants = "getVariants",
  GetSharedScreens = "getSharedScreens",
  ToggleShareStatus = "toggleShareStatus",
  GetScreensCatalog = "getScreensCatalog",
  GetScreenCreators = "getScreenCreators",
  GetMaterials = "getMaterials",
}

export type UseMutationProps<F extends (...args: any[]) => any> =
  UseMutationOptions<Awaited<ReturnType<F>>, DefaultError, Parameters<F>[0]>;

export type UseQueryResultAggregated<Src, Dst> = Omit<
  UseQueryResult<Src | undefined, Error>,
  "data"
> & {
  data: Dst | undefined;
};
