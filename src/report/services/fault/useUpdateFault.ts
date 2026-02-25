import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import { QueryKeys } from "../../../shared/types/query.types";
import { IFault } from "../../types/fault.types";
import KshirutFaultService from "./Fault.service";

export const useUpdateFault = ({ onSuccess }) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: [QueryKeys.UpdateFault],
    mutationFn: (variables: {
      faultData: IFault;
      //necessary for onSuccess
      kshirutData?: IKshirutData;
    }) => KshirutFaultService.updateFault(variables.faultData),
    onSuccess,
    onError: (e) => {
      alertify({
        messageType: "Error",
        msgContent: {
          message: "אירעה שגיאה בשמירת התקלה",
        },
        buttons: [
          {
            text: "סגירה",
            onClick: () => {},
            variant: "contained",
          },
        ],
      });
    },
  });
};
