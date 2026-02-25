import { IOption, ServerKeyValue } from "../../types/general.types";
import AxiosInstance from "../../utils/axios.instance";

class ParamService {
  public static getValueRange = async (domain: string): Promise<IOption[]> => {
    const res = await AxiosInstance.get<ServerKeyValue[]>(`parameter`, {
      params: { domain },
    });
    return res.data.map((option) => {
      return {
        value: option.key,
        label: option.value,
      };
    });
  };
}

export default ParamService;
