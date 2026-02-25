import { IComponentFilter } from "../../../dashboard/types/componentFilter.types";
import AxiosInstance from "../../../shared/utils/axios.instance";

export const getFiltersByComponentId = async (
  componentId: string
): Promise<IComponentFilter[]> => {
  const response = await AxiosInstance.get<IComponentFilter[]>("/filter", {
    params: {
      id: componentId,
    },
  });
  return response.data;
};
