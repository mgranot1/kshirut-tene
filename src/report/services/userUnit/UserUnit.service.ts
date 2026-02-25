import { AxiosRequestConfig } from "axios";
import AxiosInstance from "../../../shared/utils/axios.instance";
import { IUserUnit } from "../../types/userUnit.types";

export default class UserUnitService {
  public static async getCurrentUserUnit(config?: AxiosRequestConfig<unknown>) {
    try {
      const result = await AxiosInstance.get(`/userunit`, config);

      const userUnit: IUserUnit = {
        ...result.data,
      };

      return userUnit;
    } catch (err) {
      throw err;
    }
  }

  public static async createUserUnit(userUnit: IUserUnit): Promise<void> {
    await AxiosInstance.put(`userunit`, userUnit);
  }
}
