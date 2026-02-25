import AxiosInstance from "../../../shared/utils/axios.instance";

export default class LogService {
  public static async getLogs() {
    const res = await AxiosInstance.get(`/log`);
    return res.data;
  }
}
