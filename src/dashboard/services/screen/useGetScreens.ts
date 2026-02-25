import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import ScreenService from "./screen.service";

const useGetScreens = () => {
  return useQuery({
    queryKey: [QueryKeys.GetScreens],
    queryFn: () => ScreenService.getScreens(),
    staleTime: 300_000, // 5 minutes stale time
  });
};

export default useGetScreens;
