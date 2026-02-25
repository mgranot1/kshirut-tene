import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import ZadikDataService from "./Zadikdata.service";

export const useGetZadiksData = () => {
  return useQuery({
    queryKey: [QueryKeys.GetZadiksData],
    queryFn: () => ZadikDataService.getZadiksData(),
  });
};
