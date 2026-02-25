import { useRecoilValue } from "recoil";
import TagService from "../../report/services/tag/Tag.service";
import { paramsAtom } from "../../shared/stores/params.store";
import { ParamKey } from "../../shared/types/params.types";
import { useGetMaterials } from "../services/material/useGetMaterials";
import { TComponentFilters } from "../types/component.types";
import { FilterType } from "../types/componentFilter.types";
import { HierLevel } from "../types/family.types";
import { FieldType, IFieldData, IOptionVal } from "../types/filters.types";
import {
  getOptionsEmpty,
  getOptionsForBoolean,
} from "../utils/dashboardFilters.utils";
import { getMaterialsOptions } from "../utils/equipmentsFilters.util";
import { useFamiliesOptions } from "./useFamiliesOptions";

export const useComponentFilters = () => {
  const { getFamilyOptionsByLevel } = useFamiliesOptions();
  const { data: materials } = useGetMaterials();
  const params = useRecoilValue(paramsAtom);

  const getOptionsFromParams = async (
    param: ParamKey
  ): Promise<IOptionVal[]> => {
    return params[param].map((option) => ({
      text: option.label,
      value: option.value,
    }));
  };

  const componentFiltersFields: IFieldData<TComponentFilters>[] = [
    {
      fieldKey: FilterType.MaterialFamily,
      fieldTitle: "משפחה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.Family),
    },
    {
      fieldKey: FilterType.MainPlatform,
      fieldTitle: "פלטפורמה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.Platform),
    },
    {
      fieldKey: FilterType.SecPlatform,
      fieldTitle: "תת פלטפורמה",
      fieldType: FieldType.Checkbox,
      options: async () => getFamilyOptionsByLevel(HierLevel.SubPlatform),
    },
    {
      fieldKey: FilterType.Material,
      fieldTitle: "חומר",
      fieldType: FieldType.Checkbox,
      options: () => getMaterialsOptions(materials),
    },
    {
      fieldKey: FilterType.Tags,
      fieldTitle: "תגית",
      fieldType: FieldType.Checkbox,
      options: async () => TagService.getTagOptions(),
    },
    {
      fieldKey: FilterType.EquipmentTask,
      fieldTitle: "משימת הכלי",
      fieldType: FieldType.Checkbox,
      options: async () => getOptionsFromParams("equipmentTask"),
    },
    {
      fieldKey: FilterType.Job,
      fieldTitle: "תפקיד/סימון הכלי",
      fieldType: FieldType.TextField,
      options: async () => getOptionsEmpty(),
    },
    {
      fieldKey: FilterType.PhysicalLocation,
      fieldTitle: "מיקום פיזי",
      fieldType: FieldType.Checkbox,
      options: async () => getOptionsFromParams("physicalLocation"),
    },
    {
      fieldKey: FilterType.PhysicalLocationDetails,
      fieldTitle: "תיאור מיקום פיזי",
      fieldType: FieldType.TextField,
      options: async () => getOptionsEmpty(),
    },
    {
      fieldKey: FilterType.IsAgamForce,
      fieldTitle: "מכפיל כח אגמי",
      fieldType: FieldType.Checkbox,
      options: async () => getOptionsForBoolean(),
    },
    {
      fieldKey: FilterType.IsLogisticForce,
      fieldTitle: "מכפיל כח לוגיסטי",
      fieldType: FieldType.Checkbox,
      options: async () => getOptionsForBoolean(),
    },
    {
      fieldKey: FilterType.Pluga,
      fieldTitle: "פלוגה",
      fieldType: FieldType.TextField,
      options: async () => getOptionsEmpty(),
    },
    {
      fieldKey: FilterType.IsGdudManeuvering,
      fieldTitle: "מצב מלחמה גדוד",
      fieldType: FieldType.Checkbox,
      options: async () => [
        { text: "בלחימה", value: true },
        { text: "לא בלחימה", value: false },
      ],
    },
    {
      fieldKey: FilterType.DecidingNonKshirutCause,
      fieldTitle: "סיבת אי כשירות קובעת",
      fieldType: FieldType.Checkbox,
      options: async () => getOptionsFromParams("decidingNonKshirutCause"),
    },
    {
      fieldKey: FilterType.AvailabilityInhibitor,
      fieldTitle: "מעכבי זמינות",
      fieldType: FieldType.Checkbox,
      options: () => getOptionsFromParams("availabilityInhibitor"),
    },
  ];

  return { componentFiltersFields };
};
