import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import MaterialService from "./material.service";

export const useGetMaterials = () => {
  return useQuery({
    queryKey: [QueryKeys.GetMaterials],
    queryFn: async () => {
      return MaterialService.getMaterials();
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};
