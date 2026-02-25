import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { VariantType } from "../../types/variant.types";
import VariantService from "./variant.service";

const useGetVariants = (variantType?: VariantType) => {
  return useQuery({
    queryKey: [QueryKeys.GetVariants,variantType],
    queryFn: () => VariantService.getVariants(variantType),
  });
};

export default useGetVariants;
