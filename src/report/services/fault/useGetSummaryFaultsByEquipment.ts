import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { ISummaryFault } from "../../types/summaryFault.types";
import KshirutFaultService from "./Fault.service";

export const useGetSummaryFaultsByEquipment = (
  equipment: ISummaryFault["equipment"],
  fetchOnlyOpenFaults?: boolean
) => {
  return useQuery({
    queryKey: [QueryKeys.GetSummaryFaultsByEquipment, equipment, fetchOnlyOpenFaults],
    queryFn: () =>
      KshirutFaultService.getSummaryFaultsByEquipment(
        equipment,
        fetchOnlyOpenFaults
      ),
    enabled: !!equipment,
  });
};
