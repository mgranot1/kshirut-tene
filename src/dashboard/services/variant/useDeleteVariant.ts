import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UseMutationProps } from "../../../shared/types/query.types";
import VariantService from "./variant.service";

type DeleteVariantMutationOptions = UseMutationProps<
  typeof VariantService.deleteVariant
>;

const useDeleteVariant = (
  onSuccess?: DeleteVariantMutationOptions["onSuccess"],
  onError?: DeleteVariantMutationOptions["onError"]
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteVariant"],
    mutationFn: VariantService.deleteVariant,
    onSuccess: (...args) => {
      if(typeof onSuccess == 'function') { 
        onSuccess(...args);
      } else {
      queryClient.invalidateQueries({ queryKey: ["getVariants"] });
      queryClient.invalidateQueries({ queryKey: ["topview"] });
      toast.success("הוריאנט נמחק בהצלחה");
      }
    },
    onError: (...args) => {
      onError?.(...args);
      console.error(args[0]);
      toast("שגיאה במחיקת הוריאנט", { icon: "❗" });
    },
  });
};

export default useDeleteVariant;
