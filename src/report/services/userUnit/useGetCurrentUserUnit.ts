import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import UserUnitService from "./UserUnit.service";

export const useGetCurrentUserUnit = () => {
  return useQuery({
    queryKey: [QueryKeys.GetCurrentUserUnit],
    queryFn: () => UserUnitService.getCurrentUserUnit(),
  });
};
