import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import LogService from "./Log.service";

export const useGetLogs = () => {
  return useQuery({
    queryKey: [QueryKeys.GetLogs],
    queryFn: () => LogService.getLogs(),
  });
};
