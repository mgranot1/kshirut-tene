import AxiosInstance from "../../../shared/utils/axios.instance";
import { SearchFields } from "../../types/advancedSearch.type";
import { TComponentLocation } from "../../types/component.types";
import {
  IScreen,
  IScreenCreator,
  ISharedScreen,
  ScreenAction,
  ScreenActionBody,
} from "../../types/screen.types";

export type TScreenActions = {
  id: string;
  compMeta: TComponentLocation[];
};

class ScreenService {
  public static getScreens = async (): Promise<IScreen[]> => {
    const res = await AxiosInstance.get(`screen`);
    return res.data;
  };

  public static async deleteScreen(screenId: IScreen["id"]) {
    const screenToDelete: ScreenActionBody = {
      id: screenId,
      action: ScreenAction.Delete,
    };

    await AxiosInstance.post(`/screen`, screenToDelete);
  }

  public static async upsertScreen(screen: IScreen) {
    const screenWithAction = {
      ...screen,
      action: screen.id ? ScreenAction.Update : ScreenAction.Create,
    };
    const res = await AxiosInstance.post(`/screen`, screenWithAction);
    return res.data;
  }

  public static async updateScreenComponents(
    componentActionsBody: TScreenActions
  ) {
    const res = await AxiosInstance.put(
      `/screen/components`,
      componentActionsBody
    );
    return res.data;
  }

  public static getScreensCatalog = async (
    searchFieldsBody: SearchFields
  ): Promise<ISharedScreen[]> => {
    const res = await AxiosInstance.put(`/screen/catalog`, searchFieldsBody);
    return res.data;
  };

  public static getScreenCreators = async (): Promise<IScreenCreator[]> => {
    const res = await AxiosInstance.get(`screen/creators`);
    return res.data;
  };

  public static getSharedScreens = async (): Promise<ISharedScreen[]> => {
    const res = await AxiosInstance.get(`screen/shared`);
    return res.data;
  };

  public static async toggleShareStatus(
    toggleShareBody: ScreenActionBody
  ): Promise<boolean> {
    const res = await AxiosInstance.put(`/screen/share`, toggleShareBody);
    return res.data;
  }
}

export default ScreenService;
