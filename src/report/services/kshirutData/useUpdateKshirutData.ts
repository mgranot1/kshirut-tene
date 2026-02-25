import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { IKshirutData } from "../../../shared/types/kshirutData.types";
import { QueryKeys, UseMutationProps } from "../../../shared/types/query.types";
import KshirutDataService from "./kshirutdata.service";

type UpdateKshirutDataMutationOptions = UseMutationProps<
  typeof KshirutDataService.updateKshirutData
>;

export const useUpdateKshirutData = ({
  onSuccess,
}: UpdateKshirutDataMutationOptions) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: [QueryKeys.UpdateKshirutData],
    mutationFn: (kshirutData: IKshirutData) =>
      KshirutDataService.updateKshirutData(kshirutData),
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
    onSuccess,
  });
};
