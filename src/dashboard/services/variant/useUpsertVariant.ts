import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UseMutationProps } from "../../../shared/types/query.types";
import VariantService from "./variant.service";

type UpsertVariantMutationOptions = UseMutationProps<
  typeof VariantService.upsertVariant
>;

const useUpsertVariant = (
  onSuccess?: UpsertVariantMutationOptions["onSuccess"],
  onError?: UpsertVariantMutationOptions["onError"]
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["useCreateVariant"],
    mutationFn: VariantService.upsertVariant,
    onSuccess: (...args) => {
      if(typeof onSuccess == 'function') {
        onSuccess(...args);
      } else {
      queryClient.invalidateQueries({ queryKey: ["getVariants"] });
      queryClient.invalidateQueries({ queryKey: ["topview"] });
      toast.success("הוריאנט עודכן בהצלחה");
      }
    },
    onError: (...args) => {
      onError?.(...args);
      console.error(args[0]);
      toast("שגיאה בשמירת הוריאנט", { icon: "❗" });
    },
  });
};

export default useUpsertVariant;
