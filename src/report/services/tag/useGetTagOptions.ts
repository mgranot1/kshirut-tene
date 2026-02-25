import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import TagService from "./Tag.service";

export const useGetTagOptions = () => {
  return useQuery({
    queryKey: [QueryKeys.GetTagOptions],
    queryFn: () => TagService.getTagOptions(),
  });
};
