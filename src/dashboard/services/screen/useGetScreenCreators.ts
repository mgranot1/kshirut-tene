import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import ScreenService from "./screen.service";

const useGetScreenCreators = () => {
  return useQuery({
    queryKey: [QueryKeys.GetScreenCreators],
    queryFn: () => ScreenService.getScreenCreators(),
  });
};

export default useGetScreenCreators;
