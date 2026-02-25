import AxiosInstance from "../../../shared/utils/axios.instance";
import { convertSAPToBoolean } from "../../../shared/utils/general.utils";
import { Drilltype } from "../../pages/CustomScreen/CustomScreen";
import { KshirutType } from "../../stores/kshirutType.store";
import {
  ComponentType,
  IBaseComponent,
  IComponent,
  TComponentData,
  TComponentHeader,
  TComponentSetting,
  TComponentToSAP,
} from "../../types/component.types";
import {
  FilterType,
  IComponentFilter,
} from "../../types/componentFilter.types";
import {
  TComponentSplitBody,
  TComponentSplitRes,
} from "../../types/drilldown.types";
import { IScreen } from "../../types/screen.types";
import { convertComponentRequest } from "../../utils/component.utils";

class ComponentService {
  public static async createComponentSetting(
    screenId: IScreen["id"],
    componentSetting: TComponentSetting
  ): Promise<TComponentToSAP> {
    const componentSettingBody: TComponentToSAP = convertComponentRequest(
      componentSetting,
      screenId
    );

    const res = await AxiosInstance.post(`/component`, componentSettingBody);
    return res.data;
  }

  public static async updateComponentSetting(
    screenId: IScreen["id"],
    componentSetting: TComponentSetting
  ): Promise<TComponentToSAP> {
    const componentSettingBody: TComponentToSAP = convertComponentRequest(
      componentSetting,
      screenId
    );

    const res = await AxiosInstance.put(`/component`, componentSettingBody);

    return res.data;
  }

  public static getComponentSetting = async (
    componentId: IComponent["id"]
  ): Promise<TComponentHeader> => {
    const res = await AxiosInstance.get("component", {
      params: { componentId },
    });
    return {
      ...res.data,
      filters: res.data.filters.map((f: IComponentFilter) => {
        if (
          [
            FilterType.IsGdudManeuvering,
            FilterType.IsLogisticForce,
            FilterType.IsAgamForce,
          ].includes(f.field)
        )
          return { ...f, value: convertSAPToBoolean(f.value as "X" | "") };
        return f;
      }),
    };
  };

  public static getComponentData = async (
    componentId: IComponent["id"],
    kshirutType: KshirutType
  ): Promise<TComponentData<ComponentType>> => {
    const res = await AxiosInstance.get("component/data", {
      params: { componentId, kshirutType },
    });
    return res.data;
  };

  public static getSplitComponents = async (
    drillBy: Drilltype,
    filters: IComponentFilter[],
    kshirutType: KshirutType,
    componentType: ComponentType
  ): Promise<TComponentSplitRes<ComponentType>> => {
    const componentDrilldownBody: TComponentSplitBody = {
      drillBy: drillBy,
      filters: filters,
      kshirutType: kshirutType,
      componentType: componentType,
    };

    const res = await AxiosInstance.post(
      `/component/drilldown`,
      componentDrilldownBody
    );
    return res.data;
  };

  public static getScreenComponents = async (
    screenId: IScreen["id"]
  ): Promise<IBaseComponent[]> => {
    const res = await AxiosInstance.get("component/components", {
      params: { screenId },
    });
    return res.data;
  };
}

export default ComponentService;
