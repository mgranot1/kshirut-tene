import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { dashboardGeneralDataAtom } from "../../stores/DashboardData.store";
import { OrganizationalLevel } from "../../types/dashboardOrgLevel.types";
import DashboardService from "./dashboard.service";

const useGetDashboardEquipments = (
  organizationalLevel: OrganizationalLevel | undefined
) => {
  const setTablesEquipments = useSetRecoilState(dashboardGeneralDataAtom);

  const query = useQuery({
    queryKey: ["dashboardData", JSON.stringify(organizationalLevel)],
    queryFn: async () => {
      return DashboardService.getDashboardData(organizationalLevel!);
    },
    enabled: !!organizationalLevel,
    refetchOnMount: false, // makes sure not fetching when passing pages
  });

  // TO-DO : check if the atom can be deleted
  useEffect(() => {
    query.data && setTablesEquipments(query.data);
  }, [query.data]);

  return query;
};

export default useGetDashboardEquipments;
