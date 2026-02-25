import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { KshirutType } from "../../stores/kshirutType.store";
import { IComponent } from "../../types/component.types";
import ComponentService from "./component.service";

export const useGetComponentData = (
  componentId: IComponent["id"],
  kshirutType: KshirutType
) => {
  return useQuery({
    queryKey: [QueryKeys.GetComponentData, componentId, kshirutType],
    queryFn: () => ComponentService.getComponentData(componentId, kshirutType),
    enabled: !!componentId && !!kshirutType,
  });
};
