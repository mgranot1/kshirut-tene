import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { KshirutType } from "../../stores/kshirutType.store";
import { ComponentType } from "../../types/component.types";
import { IComponentFilter } from "../../types/componentFilter.types";
import ComponentService from "./component.service";

export const useGetSplitComponent = (
  drillBy: Drilltype,
  filters: IComponentFilter[],
  kshirutType: KshirutType,
  componentType: ComponentType
) => {
  const getSplitComponents = async () => {
    return await ComponentService.getSplitComponents(
      drillBy,
      filters,
      kshirutType,
      componentType
    );
  };

  return useQuery({
    queryKey: [QueryKeys.GetSplitComponent, drillBy, filters, kshirutType],
    queryFn: getSplitComponents,
    staleTime: 300_000, // 5 minutes stale time
  });
};
