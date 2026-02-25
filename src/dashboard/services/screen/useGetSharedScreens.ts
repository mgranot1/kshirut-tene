import { useQuery } from "@tanstack/react-query";
import ScreenService from "./screen.service";
import { QueryKeys } from "../../../shared/types/query.types";

const useGetSharedScreens = () => {
  return useQuery({
    queryKey: [QueryKeys.GetSharedScreens],
    queryFn: () => ScreenService.getSharedScreens(),
  });
};

export default useGetSharedScreens;
