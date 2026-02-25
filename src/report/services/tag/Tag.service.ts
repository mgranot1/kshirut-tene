import { IOptionVal } from "../../../dashboard/types/filters.types";
import AxiosInstance from "../../../shared/utils/axios.instance";
import { ChangeTagsAPIInput, EquipmentTag, Tag } from "../../types/tag.types";

export default class TagService {
  public static async getTags(equipmentNumber: number) {
    const res = await AxiosInstance.get<EquipmentTag[]>(`/tag`, {
      params: {
        equipmentNumber,
      },
    });
    return res.data;
  }

  public static async getTagOptions(): Promise<IOptionVal[]> {
    const res = await AxiosInstance.get<Tag[]>(`/tag/all`);

    return res.data.map((o) => ({ value: o.id, text: o.text }));
  }

  public static async addTags(equipmentNumber: string, newTagIds: string[]) {
    const res = await AxiosInstance.post<
      ChangeTagsAPIInput,
      any,
      ChangeTagsAPIInput
    >(`/tag`, {
      equipment: equipmentNumber,
      ids: newTagIds,
      deletionFlag: false,
    });

    return res.data;
  }

  public static async removeTag(equipmentNumber: string, tagId: string) {
    const res = await AxiosInstance.post<
      ChangeTagsAPIInput,
      any,
      ChangeTagsAPIInput
    >(`/tag`, {
      equipment: equipmentNumber,
      ids: [tagId],
      deletionFlag: true,
    });

    return res.data;
  }
}
