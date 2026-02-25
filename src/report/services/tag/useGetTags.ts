import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import TagService from "./Tag.service";

export const useGetTags = (equipment: IZadikData["equipment"]) => {

  const result = useQuery({
    queryKey: [QueryKeys.GetTags, equipment],
    queryFn: () => TagService.getTags(equipment),
    retry: false,
    enabled: !!equipment,
  });
  return result;
};
