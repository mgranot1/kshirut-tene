import AxiosInstance from "../../../shared/utils/axios.instance";
import { ILog } from "../../types/log.types";

export default class ViewService {
  public static async updateView(
    logType: ILog["logType"],
    logTypeKey: ILog["logTypeKey"]
  ) {
    return await AxiosInstance.post(`view`, { logType, logTypeKey });
  }
}
