import { useQuery } from "@tanstack/react-query";
import { IKshirutData } from "../../types/kshirutData.types";
import { QueryKeys } from "../../types/query.types";
import TsavIrgunService from "./tsavIrgun.service";

export const useGetIsManeuveringRoutineGdud = (
  tplnrRoutine?: IKshirutData["tplnrRoutine"],
  enabled?: boolean
) => {
  return useQuery({
    queryKey: [QueryKeys.GetIsManeuveringGdud, tplnrRoutine!],
    queryFn: () => TsavIrgunService.getIsManeuveringGdud(tplnrRoutine!),
    enabled: !!tplnrRoutine && enabled,
  });
};
