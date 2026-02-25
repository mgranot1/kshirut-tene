import { IZadikData } from "../../../shared/types/ZadikData.types";
import AxiosInstance from "../../../shared/utils/axios.instance";

export default class ZadikDataService {
  public static async getZadiksDataByFamily(
    family?: string
  ): Promise<IZadikData[]> {
    const res = await AxiosInstance.get(`/equipment/family`, {
      params: { family },
    });
    return res.data;
  }

  public static async getZadiksData(): Promise<IZadikData[]> {
    const res = await AxiosInstance.get(`/equipment/family`);
    return res.data;
  }

  public static async getZadikData(
    equipment: IZadikData["equipment"]
  ): Promise<IZadikData> {
    const res = await AxiosInstance.get(`/equipment`, {
      params: { equipment },
    });

    return res.data;
  }
}
