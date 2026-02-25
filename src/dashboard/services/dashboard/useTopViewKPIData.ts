import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { UseQueryResultAggregated } from "../../../shared/types/query.types";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import { SelectableFilter } from "../../types/componentFilter.types";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { IDashboardFiltersValue } from "../../types/filters.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { FetchTopViewData, KPIData } from "../../types/topview.types";
import { IVariant } from "../../types/variant.types";
import { convertDashboardFiltersToTopViewFilters } from "../../utils/convertDashboardFiltersToTopViewFilters";
import { getLastItemFromTree } from "../../utils/dashBoardOrgLevel.utils";
import DashboardService from "./dashboard.service";

type UseKpiDataReturn = UseQueryResultAggregated<FetchTopViewData, KPIData>;

const useKpiData = (
  selectedFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[],
  selectedVariantId?: IVariant["variantId"]
): UseKpiDataReturn => {
  const orgTree = useRecoilValue(orgTreeAtom);
  const kshirutType = useRecoilValue(kshirutTypeState);

  const filters: SelectableFilter[] = useMemo(
    () => convertDashboardFiltersToTopViewFilters(selectedFilters),
    [selectedFilters]
  );

  const operation: string | undefined = orgTree
    ? (orgTree[OrgLevelCode.TREE_TYPE][0]?.value ?? "")
    : undefined;

  const tplnr: string | undefined = getLastItemFromTree(orgTree);

  const query = useQuery({
    queryKey: [
      "topview",
      operation,
      tplnr,
      kshirutType,
      filters,
      selectedVariantId,
    ],
    queryFn: () =>
      DashboardService.fetchTopViewData({
        operation: operation!,
        funclocOrObjid: tplnr!,
        kshirutType: kshirutType.value,
        filters,
        variantId: selectedVariantId,
      }),
    enabled: operation !== undefined && !!kshirutType,
  });

  const newData: KPIData | undefined = query.data
    ? {
        cacheKey: query.data.cacheKey,
        kshirutByFamily: query.data.kshirutByFamily,
        "24KashirEquipmentsCountPie": query.data["24KashirEquipmentsCountPie"],
        "48KashirEquipmentsCountPie": query.data["48KashirEquipmentsCountPie"],
        "72KashirEquipmentsCountPie": query.data["72KashirEquipmentsCountPie"],
        rnKashirEquipmentsCountPie: query.data.rnKashirEquipmentsCountPie,
        totalEquipmentsCountPie: query.data.totalEquipmentsCountPie,
        agamKshirutAmount: query.data.agamKshirutAmount,
        agamKshirutTotal: query.data.agamKshirutTotal,
        agamKshirutPercentage:
          (query.data.agamKshirutAmount / query.data.agamKshirutTotal) * 100,
        logisticKshirutAmount: query.data.logisticKshirutAmount,
        logisticKshirutTotal: query.data.logisticKshirutTotal,
        logisticKshirutPercentage:
          (query.data.logisticKshirutAmount / query.data.logisticKshirutTotal) *
          100,
        technicalGrinds: query.data.technicalGrinds,
        grindFaultsCount: query.data.grindFaultsCount,
        grindEquipmentsCount:
          query.data.technicalGrinds + query.data.operationalGrinds,
        operationalGrinds: query.data.operationalGrinds,
        squadAwaitingFaultsCount: query.data.squadAwaitingFaultsCount,
        squadAwaitingEquipmentsCount: query.data.squadAwaitingEquipsCount,
        recoveryAwaitingFaultsCount: query.data.recoveryAwaitingFaultsCount,
        recoveryAwaitingEquipmentsCount: query.data.recoveryAwaitingEquipsCount,
        transportAwaitingFaultCount: query.data.transportAwaitingFaultCount,
        transportAwaitingEquipmentCount: query.data.transportAwaitingEquipCount,
        WinchRequiredEquipmentsCount: query.data.winchRequiredEquipsCount,
        equipmentsWithMissingCount: query.data.equipmentsWithMissingCount,
        materialsCount: query.data.missingHhsCount,
        invalidHHsCount: query.data.invalidMissingHhsCount,
        malfunctionedEquipmentsInOurArea: [
          {
            title: "כלים תקולים בשטחנו",
            value:
              query.data.malfunEquipInOurAreaCount +
              query.data.malfunEquipInEgedCount +
              query.data.malfunEquipInMashaCount +
              query.data.malfunEquipInIndustrCount +
              query.data.malfunEquipInYamahCount,
            valueDesc: "כלים",
            subtitle: `${query.data.faultsInOurAreaCount} תקלות`,
          },
          {
            title: "בשטחנו",
            value: query.data.malfunEquipInOurAreaCount,
          },
          {
            title: "אגד",
            value: query.data.malfunEquipInEgedCount,
          },
          {
            title: 'מש"א',
            value: query.data.malfunEquipInMashaCount,
          },
          {
            title: "תעשיות",
            value: query.data.malfunEquipInIndustrCount,
          },
          {
            title: 'ימ"ח מבצעי',
            value: query.data.malfunEquipInYamahCount,
          },
        ],
        malfunctionedEquipmentsInWar: [
          {
            title: "כלים תקולים במרחב הלחימה",
            value: query.data.malfuncEquipsInWar,
            valueDesc: "כלים",
            subtitle: `${query.data.faultsInWarCount} תקלות`,
          },
          {
            title: "ניוד עצמאי",
            value: query.data.malfunEqIndependMobilCount,
          },
          {
            title: "ניוד לא עצמאי",
            value:
              query.data.malfuncEquipsInWar -
              query.data.malfunEqIndependMobilCount,
          },
        ],
      }
    : undefined;

  return { ...query, data: newData };
};

export default useKpiData;
