import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { IComment } from "../../types/comment.types";
import KshirutChatService from "./kshirutChat.service";

export const useCreateChat = ({ onSuccess }) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: ["createChat"],
    mutationFn: (variables: { comment: IComment }) =>
      KshirutChatService.createChat(variables.comment),
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
        // msgContent: { message: "אירעה שגיאה בשמירת ההודעה",},
      });
    },
    onSuccess: onSuccess,
  });
};
