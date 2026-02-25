import { IFamily } from "../../../dashboard/types/family.types";
import AxiosInstance from "../../utils/axios.instance";

class FamilyService {
  public static getFamilies = async (): Promise<IFamily[]> => {
    const res = await AxiosInstance.get(`family`);

    return res.data;
  };
}

export default FamilyService;
