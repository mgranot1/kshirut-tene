import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { queryClient } from "../../../queryClient";
import TagService from "./Tag.service";

export const useAddTags = (equipmentNumber: string, newTagIds: string[]) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: ["addTags", equipmentNumber, newTagIds],
    mutationFn: () => TagService.addTags(equipmentNumber, newTagIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTags"] });
    },
    onError: (error: any) => {
      alertify({
        messageType: "Error",
        msgContent: { message: error?.response?.data?.message },
      });
    },
  });
};
