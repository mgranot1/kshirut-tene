import { useQuery } from "@tanstack/react-query";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import { QueryKeys } from "../../../shared/types/query.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import KshirutDataService from "./kshirutdata.service";

export const useGetKshirutData = (equipment?: IZadikData["equipment"]) => {
  return useQuery({
    queryKey: [QueryKeys.GetKshirutData, equipment],
    queryFn: () =>
      equipment ? KshirutDataService.getKshirutData(equipment) : undefined,
    enabled: !!equipment,
    initialData: { equipment } as IKshirutData,
    throwOnError: true,
  });
};
