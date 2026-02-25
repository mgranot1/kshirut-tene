import { MRT_RowData } from "material-react-table";
import AxiosInstance from "../../../shared/utils/axios.instance";
import {
  IVariant,
  IVariantBase,
  TableVariant,
  VariantType,
} from "../../types/variant.types";
import { convertIVariantToTableVariant } from "../../utils/tableVariant.utils";

class VariantService {
  public static getVariants = async (
    variantType: VariantType = VariantType.dynamicChart
  ): Promise<IVariant[]> => {
    const res = await AxiosInstance.get(`variant`, {
      params: {
        variantType,
      },
    });

    return res.data;
  };

  public static getVariantsByTable = async <T extends MRT_RowData>(
    tableId: string
  ): Promise<TableVariant<T>[]> => {
    const res = await AxiosInstance.get(`variant`, {
      params: {
        variantType: VariantType.table,
        tableId,
      },
    });

    return res.data.map(convertIVariantToTableVariant);
  };

  public static upsertVariant = async (
    variant: IVariantBase
  ): Promise<IVariant | undefined> => {
    const res = await AxiosInstance.post(`variant`, variant);

    return res.data;
  };

  public static deleteVariant = async (variantId: IVariant["variantId"]) => {
    await AxiosInstance.delete(`variant/${variantId}`);
  };
}

export default VariantService;
