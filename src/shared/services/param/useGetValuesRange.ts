import { useQueries } from "@tanstack/react-query";
import { IOption } from "../../types/general.types";
import { ParamKey, paramsKey } from "../../types/params.types";
import ParamService from "./param.service";

export type Params = Record<ParamKey, IOption[]>;

export function useGetValuesRange() {
  const results = useQueries({
    queries: Object.values(paramsKey).map((domain: string) => ({
      queryKey: ["getValueRange", domain],
      queryFn: () => ParamService.getValueRange(domain),
      enabled: !!domain,
    })),
  });
  const isLoading = results.some((r) => r.isLoading);

  const data = results.reduce((acc, result, i) => {
    acc[Object.keys(paramsKey)[i]] = result.data;
    return acc;
  }, {} as Params);
  return { data, isLoading };
}
