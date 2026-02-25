import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QueryKeys } from "../../../shared/types/query.types";
import ScreenService from "./screen.service";

export const useToggleShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QueryKeys.ToggleShareStatus],
    mutationFn: ScreenService.toggleShareStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetScreens] });
      data
        ? toast.success("המסך שותף איתך")
        : toast.success("המסך הוסר משיתוף");
    },
    onError: () => {
      toast.error("עדכון מסך נכשל");
    },
  });
};
