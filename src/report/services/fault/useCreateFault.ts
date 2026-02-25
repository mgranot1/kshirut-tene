import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import { IFault } from "../../types/fault.types";
import KshirutFaultService from "./Fault.service";

export const useCreateFault = ({ onsuccss }) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: ["createFault"],
    mutationFn: (variables: {
      faultData: IFault;
      kshirutData?: IKshirutData;
    }) => KshirutFaultService.createFault(variables.faultData),
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
    onSuccess: onsuccss,
  });
};
