import { useQuery } from "@tanstack/react-query";
import { OrgLevelCode } from "../../../dashboard/types/dashboardOrgLevel.types";
import { IOption } from "../../types/general.types";
import { QueryKeys, UseQueryResultAggregated } from "../../types/query.types";
import { ITsavIrgunLevel } from "../../types/tsavIrgun.types";
import { OPERATIONS_INDEX, ROUTINE_TREE_TYPE } from "../../utils/constants";
import TsavIrgunService from "./tsavIrgun.service";

export const useGetOperations = () => {
  return useQuery({
    queryKey: [QueryKeys.GetOperations],
    queryFn: () => TsavIrgunService.getOperations(),
  });
};

type UseGetTreeTypesReturn = UseQueryResultAggregated<
  IOption[],
  ITsavIrgunLevel[]
>;

export const useGetTreeTypes = (): UseGetTreeTypesReturn => {
  const query = useGetOperations();

  const tsavIrgunOperation = query.data
    ?.concat({ value: ROUTINE_TREE_TYPE, label: 'צה"ל' })
    .map(
      (operation) =>
        ({
          fatherIndex: 0,
          index: OPERATIONS_INDEX,
          funcLoc: operation.value,
          objid: operation.value,
          funcLocDesc: operation.label,
          hierLevel: OrgLevelCode.TREE_TYPE,
        }) as ITsavIrgunLevel
    );

  return { ...query, data: tsavIrgunOperation };
};
