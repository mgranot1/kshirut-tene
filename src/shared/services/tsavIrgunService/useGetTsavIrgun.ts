import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QueryKeys } from "../../types/query.types";
import { ITsavIrgunLevel } from "../../types/tsavIrgun.types";
import TsavIrgunService from "./tsavIrgun.service";

export const useGetTsavIrgun = (
  operation: string | undefined
): UseQueryResult<ITsavIrgunLevel[], Error> => {
  const isEmergency = !!operation;

  if (isEmergency) {
    return useQuery({
      queryKey: [QueryKeys.GetTsavIrgunEmergency, operation],
      queryFn: () => TsavIrgunService.getTsavIrgunEmergency(operation),
      enabled: true,
    });
  }

  return useQuery({
    queryKey: [QueryKeys.GetTsavIrgun],
    queryFn: () => TsavIrgunService.getTsavIrgun(),
    enabled: true,
  });
};
