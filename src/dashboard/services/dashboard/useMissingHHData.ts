import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { QueryKeys } from "../../../shared/types/query.types";
import useTopViewFilters from "../../hooks/useTopViewFilters";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import { SelectableFilter } from "../../types/componentFilter.types";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { convertDashboardFiltersToTopViewFilters } from "../../utils/convertDashboardFiltersToTopViewFilters";
import { getLastItemFromTree } from "../../utils/dashBoardOrgLevel.utils";
import DashboardService from "./dashboard.service";

export const useMissingHHData = (enabled: boolean = true) => {
  const { selectedFilters } = useTopViewFilters();
  const orgTree = useRecoilValue(orgTreeAtom);
  const kshirutType = useRecoilValue(kshirutTypeState);

  const filters: SelectableFilter[] = useMemo(
    () => convertDashboardFiltersToTopViewFilters(selectedFilters),
    [selectedFilters]
  );

  const operation: string | undefined = orgTree
    ? (orgTree[OrgLevelCode.TREE_TYPE]?.[0]?.value ?? "")
    : undefined;

  const tplnr: string | undefined = getLastItemFromTree(orgTree);

  const query = useQuery({
    queryKey: [
      QueryKeys.GetMissingHHData,
      operation,
      tplnr,
      kshirutType,
      JSON.stringify(filters),
    ],
    queryFn: () =>
      DashboardService.fetchMissingHH({
        operation: operation!,
        funclocOrObjid: tplnr!,
        kshirutType: kshirutType.value,
        filters,
      }),
    enabled: !!operation && !!kshirutType && enabled,
    staleTime: Infinity, // prevents auto refetch after enabling to not refetch each time popup opens
  });

  return { ...query, data: query?.data };
};
