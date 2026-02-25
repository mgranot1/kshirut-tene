import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QueryKeys, UseMutationProps } from "../../../shared/types/query.types";
import ScreenService from "./screen.service";

type UpsertScreenMutationOptions = UseMutationProps<
  typeof ScreenService.upsertScreen
>;

export const useUpsertScreen = ({
  onSuccess,
  onError,
}: UpsertScreenMutationOptions) => {
  return useMutation({
    mutationKey: [QueryKeys.UpsertScreen],
    mutationFn: ScreenService.upsertScreen,
    onSuccess: onSuccess,
    onError: onError,
    onMutate: () => {
      const id = toast.loading("עדכון מסך");
      return { toastId: id };
    },
    onSettled: (_data, _error, _variables, context) => {
      toast.dismiss(context?.toastId);
    },
  });
};
