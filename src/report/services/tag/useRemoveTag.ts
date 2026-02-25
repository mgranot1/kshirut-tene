import { useMutation } from "@tanstack/react-query";
import { useAlertify } from "../../../contexts/AlertContext";
import { queryClient } from "../../../queryClient";
import TagService from "./Tag.service";

export const useRemoveTag = (equipmentNumber: string) => {
  const { alertify } = useAlertify();

  return useMutation({
    mutationKey: ["removeTag", equipmentNumber],
    mutationFn: (variables: { newTagIds: string }) =>
      TagService.removeTag(equipmentNumber, variables.newTagIds),
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
