import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../../shared/types/query.types";
import { IComment } from "../../types/comment.types";
import KshirutChatService from "./kshirutChat.service";

export const useGetChatByFault = (faultNum: IComment["faultNum"]) => {
  return useQuery({
    queryKey: [QueryKeys.GetChatByFault, faultNum],
    queryFn: () => KshirutChatService.getChatByFault(faultNum),
    enabled: !!faultNum,
  });
};
