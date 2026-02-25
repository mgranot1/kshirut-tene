import AxiosInstance from "../../../shared/utils/axios.instance";
import {
  convertDateToTimeZonedISOString,
  convertToTimestamp,
} from "../../../shared/utils/lastChange.util";
import { IComment } from "../../types/comment.types";
import { convertCommentDate } from "../fault/Fault.service";

export default class KshirutChatService {
  public static async createChat(comment: IComment) {
    const res = await AxiosInstance.post(`/chat`, {
      ...comment,
      creationTimestamp: convertDateToTimeZonedISOString(
        comment.creationTimestamp
      ),
    });
    return {
      ...res.data,
      creationTimestamp: convertToTimestamp(res.data.creationTimestamp),
    };
  }

  public static async getChatByFault(faultNum: string) {
    const res = await AxiosInstance.get(`/chat`, {
      params: {
        faultNum,
      },
    });

    return convertCommentDate(res.data);
  }
}
