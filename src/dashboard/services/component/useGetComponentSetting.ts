import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { QueryKeys } from "../../../shared/types/query.types";
import { componentSettingSelector } from "../../stores/componentSettingSelector.store";
import { IComponent } from "../../types/component.types";
import { adaptResponseToComponentSetting } from "../../utils/component.utils";
import ComponentService from "./component.service";

export const useGetComponentSetting = (componentId: IComponent["id"]) => {
  const componentSettingFromStack = useRecoilValue(
    componentSettingSelector(componentId)
  );

  const query = useQuery({
    queryKey: [QueryKeys.GetComponentSetting, componentId],
    queryFn: () => ComponentService.getComponentSetting(componentId),
    enabled: !componentSettingFromStack && !!componentId,
  });

  const data = componentSettingFromStack
    ? componentSettingFromStack
    : query.data;

  return {
    data: adaptResponseToComponentSetting(data),
    isLoading: !componentSettingFromStack ? query.isLoading : false,
    isError: !componentSettingFromStack ? query.isError : false,
    isSuccess: !componentSettingFromStack ? query.isSuccess : true,
  };
};
