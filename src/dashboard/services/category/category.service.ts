import AxiosInstance from "../../../shared/utils/axios.instance";
import { ICategory } from "../../types/category.types";

class CategoryService {
  public static getCategories = async (): Promise<ICategory[]> => {
    const res = await AxiosInstance.get(`category`);
    return res.data;
  };
}

export default CategoryService;
