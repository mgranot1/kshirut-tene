import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAlertify } from "../../../contexts/AlertContext";
import { QueryKeys } from "../../types/query.types";
import TsavIrgunService from "./tsavIrgun.service";

type useUpdateIsManeuveringGdudProps = { onSuccess?: () => void };
export const useUpdateIsManeuveringGdud = ({
  onSuccess,
}: useUpdateIsManeuveringGdudProps = {}) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: [QueryKeys.UpdateIsManeuveringGdud],
    mutationFn: (variables: { gdud: string; isManeuvering: boolean }) =>
      TsavIrgunService.updateIsManeuveringGdud(
        variables.gdud,
        variables.isManeuvering
      ),
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
    onSuccess: onSuccess
      ? onSuccess
      : () => {
          toast.success("מצב מלחמה גדוד נשמר בהצלחה");
        },
  });
};
