import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { IFault } from "../../types/fault.types";
import KshirutFaultService from "./Fault.service";

export const useGetHHDescriptions = (faultNum: IFault["faultNum"]) => {
  return useQuery({
    queryKey: [QueryKeys.GetHHDescriptions, faultNum],
    queryFn: () => KshirutFaultService.getHHDescriptions(faultNum),
    enabled: !!faultNum,
  });
};
