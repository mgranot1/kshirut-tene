import AxiosInstance from "../../../shared/utils/axios.instance";
import { MaterialDescription } from "../../types/material.types";

class MaterialService {
  public static async getMaterials(): Promise<MaterialDescription[]> {
    const res = await AxiosInstance.get<MaterialDescription[]>("/material");
    return res.data;
  }
}

export default MaterialService;
