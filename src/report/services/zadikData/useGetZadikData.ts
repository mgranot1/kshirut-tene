import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAlertify } from "../../../contexts/AlertContext";
import { QueryKeys } from "../../../shared/types/query.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import ZadikDataService from "./Zadikdata.service";
export type props = { onSuccess?: (ZadikData: IZadikData) => void };
export const useGetZadikData = ({ onSuccess }: props = {}) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: [QueryKeys.GetZadikData],
    mutationFn: (variables: { equipment: IZadikData["equipment"] }) =>
      ZadikDataService.getZadikData(variables.equipment),
    onSuccess: onSuccess
      ? onSuccess
      : () => {
          toast.success("מצב מלחמה גדוד נשמר בהצלחה");
        },
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
  });
};

export const useGetZadikQuery = ( { equipment , onSuccess}: {equipment?: IZadikData['equipment']} & props ) => {
  return useQuery({
    queryKey: [QueryKeys.GetZadikQuery],
    queryFn: () => equipment ? ZadikDataService.getZadikData(equipment) : undefined,
    enabled: !!equipment,
    initialData: {equipment: equipment} as IZadikData,
    throwOnError: true
  });
}
