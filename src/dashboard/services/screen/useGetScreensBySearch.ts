import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { QueryKeys } from "../../../shared/types/query.types";
import { catalogSearchAtom } from "../../stores/catalogSearch.store";
import ScreenService from "./screen.service";

export const useGetScreensCatalog = () => {
  const catalogSearch = useRecoilValue(catalogSearchAtom);

  return useQuery({
    queryKey: [QueryKeys.GetScreensCatalog, JSON.stringify(catalogSearch)],
    queryFn: () => ScreenService.getScreensCatalog(catalogSearch),
  });
};
