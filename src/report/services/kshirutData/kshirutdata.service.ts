import {
  IKshirutData,
  UpdateKshirutData,
} from "../../../shared/types/kshirutData.types";
import AxiosInstance from "../../../shared/utils/axios.instance";

export default class KshirutDataService {
  public static async getKshirutData(
    equipment: IKshirutData["equipment"]
  ): Promise<IKshirutData> {
    const res = await AxiosInstance.get("kshirut", { params: { equipment } });
    return res.data;
  }

  public static async updateKshirutData(
    data: IKshirutData
  ): Promise<IKshirutData> {
    const kshirutUpdateData: UpdateKshirutData = {
      ...data,
      changeTimestamp: undefined,
    };

    const updatedKsirutReport = await AxiosInstance.post(
      `kshirut`,
      kshirutUpdateData
    );

    return updatedKsirutReport.data;
  }
}
