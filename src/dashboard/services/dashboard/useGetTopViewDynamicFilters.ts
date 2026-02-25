import { useQuery } from "@tanstack/react-query";
import DashboardService from "./dashboard.service";

export const useGetTopViewDynamicFilters = (cacheKey: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["getTopViewDynamicFilters", cacheKey],
    queryFn: () =>
      cacheKey
        ? DashboardService.getTopViewDynamicFilters(cacheKey)
        : undefined,
    enabled: !!cacheKey && enabled,
  });
};
