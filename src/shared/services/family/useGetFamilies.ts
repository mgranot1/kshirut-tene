import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../types/query.types";
import FamilyService from "./family.service";

export const useGetFamilies = () => {
  return useQuery({
    queryKey: [QueryKeys.GetFamilies],
    queryFn: () => FamilyService.getFamilies(),
  });
};
