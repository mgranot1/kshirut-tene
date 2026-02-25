import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { VariantType } from "../../types/variant.types";
import { convertIVariantToTableVariant } from "../../utils/tableVariant.utils";
import VariantService from "./variant.service";

const useGetTableVariants = (tableId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GetVariants,VariantType.table, tableId],
    initialData: [],
    queryFn: () => VariantService.getVariantsByTable(tableId),
  });
};

export default useGetTableVariants;
