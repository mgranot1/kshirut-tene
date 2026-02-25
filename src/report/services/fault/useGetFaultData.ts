import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { IFault } from "../../types/fault.types";
import KshirutFaultService from "./Fault.service";

export const useGetFaultData = (faultNum?: IFault["faultNum"]) => {
  return useQuery({
    queryKey: [QueryKeys.GetFaultData, faultNum],
    queryFn: () =>
      faultNum ? KshirutFaultService.getFaultData(faultNum) : undefined,
    enabled: !!faultNum,
  });
};
