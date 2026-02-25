import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TComponentSetting, TComponentToSAP } from "../../types/component.types";
import { IScreen } from "../../types/screen.types";
import ComponentService from "./component.service";

export const useUpdateComponentSetting = (options? : {onSuccess?: (component: TComponentToSAP) => void}) => {
  const updateComponentSetting = (variables: {
    screenId: IScreen["id"];
    componentSetting: TComponentSetting;
  }) => {
    return ComponentService.updateComponentSetting(
      variables.screenId,
      variables.componentSetting
    );
  };
  return useMutation({
    mutationKey: ["updateComponentSetting"],
    mutationFn: updateComponentSetting,
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.message ?? "שגיאה"}`);
    },
    onSuccess: (newComponentSettings) => { 
      options?.onSuccess ? options.onSuccess(newComponentSettings) :
      toast.success("הרכיב עודכן בהצלחה");
    },
    onMutate: () => {
      const id = toast.loading("עדכון רכיב בתהליך");
      return { toastId: id };
    },
    onSettled: (_data, _error, _variables, context) => {
      toast.dismiss(context?.toastId);
    },
  });
};
