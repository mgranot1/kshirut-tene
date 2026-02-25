import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../types/query.types";
import TsavIrgunService from "./tsavIrgun.service";

export const useGetEmergencyGduds = () => {
  return useQuery({
    queryKey: [QueryKeys.GetEmergencyGduds],
    queryFn: () => TsavIrgunService.getEmergencyGduds(),
  });
};
