import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TComponentSetting } from "../../types/component.types";
import { IScreen } from "../../types/screen.types";
import { getNewComponentLocation } from "../../utils/component.utils";
import ComponentService from "./component.service";
import useGetScreenComponents from "./useGetScreenComponents";
import { useCurrentPath } from "../../../shared/hooks/useCurrentPath";

export const useCreateComponentSetting = () => {
  const screenId = useCurrentPath();
  const { data: componnets, refetch: refetchComponents } = useGetScreenComponents(screenId)

  const createComponentSetting = (variables: {
    screenId: IScreen["id"];
    componentSetting: TComponentSetting;
  }) => {
    const newLocation = getNewComponentLocation(
      componnets ?? [],
      variables.componentSetting.type
    );
    const newComponentSettingForm = {
      ...variables.componentSetting,
      compColumn: newLocation.compColumn,
      compRow: newLocation.compRow,
    };
    return ComponentService.createComponentSetting(
      variables.screenId,
      newComponentSettingForm
    );
  };

  return useMutation({
    mutationKey: ["createComponentSetting"],
    mutationFn: createComponentSetting,
    onError: (error: any) => {
      toast.error(`${error?.response?.data?.message ?? "שגיאה"}`);
    },
    onSuccess: () => {
      refetchComponents();
      toast.success("הרכיב נוצר בהצלחה");
    },
    onMutate: () => {
      const id = toast.loading("יצירת רכיב מתבצעת");
      return { toastId: id };
    },
    onSettled: (_data, _error, _variables, context) => {
      toast.dismiss(context?.toastId);
    },
  });
};
