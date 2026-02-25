import { StaticDatePickerProps } from "@mui/x-date-pickers";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { paramsAtom } from "../../shared/stores/params.store";
import { MaterialTypes } from "../../shared/types/mean.types";
import { useGetMaterials } from "../services/material/useGetMaterials";
import { dashboardGeneralDataAtom } from "../stores/DashboardData.store";
import { generalFiltersState } from "../stores/DashFilters.store";
import { orgTreeAtom } from "../stores/orgLevelTree.store";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";
import { HierLevel } from "../types/family.types";
import { DashboardFault } from "../types/FaultTable.types";
import {
  FieldType,
  IDashboardFiltersValue,
  IFieldData,
  IOptionVal,
} from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";
import {
  getOptionsEmpty,
  getOptionsForBoolean,
  getOptionsNumber,
} from "../utils/dashboardFilters.utils";
import {
  getFilterOptionsFromParams,
  getMaterialsOptions,
} from "../utils/equipmentsFilters.util";
import { useFamiliesOptions } from "./useFamiliesOptions";

export type FilterChange<T> = {
  fieldKey: keyof T;
  fieldOptions?: {
    clearField?: boolean;
    isNotEqual?: boolean;
  };
  filterValues: (string | number | boolean)[];
};
export interface IFilterStructure<T> {
  id: string;
  category?: string;
  children?: IFilterStructure<T>[];
  fieldKey?: keyof T;
  fieldTitle?: string;
  fieldType?: FieldType;
  options?: () => IOptionVal[] | Promise<IOptionVal[]>;
  dateOptions?: Partial<StaticDatePickerProps<Date>>;
  isExpanded?:boolean;
}

export const useDbdGeneralFilters = () => {
  const dashboardEquipments = useRecoilValue(dashboardGeneralDataAtom);

  const [selectedFilters, setSelectedFilters] =
    useRecoilState(generalFiltersState);
  const params = useRecoilValue(paramsAtom);

  const orgTree = useRecoilValue(orgTreeAtom);
  const { getFamilyOptionsByLevel } = useFamiliesOptions();

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const { data: materials } = useGetMaterials();

  const addFilters = async (
    filtersToAdd: FilterChange<GeneralDashboardTableRow>[],
    options?: { clear?: boolean }
  ) => {
    const updatedFilters: IDashboardFiltersValue<GeneralDashboardTableRow>[] =
      options?.clear ? [] : [...selectedFilters];

    for (const addFilter of filtersToAdd) {
      const filterField = allFields.find(
        (field) => field.fieldKey === addFilter.fieldKey
      );

      if (!filterField) {
        throw Error(`Can't filter that value`);
      }

      const existingFilterIndex = updatedFilters.findIndex(
        (existingFilter) => existingFilter.fieldKey === addFilter.fieldKey
      );
      const existingCurrFilter =
        existingFilterIndex !== -1
          ? updatedFilters[existingFilterIndex]
          : undefined;
      const currentFilter: IDashboardFiltersValue<GeneralDashboardTableRow> =
        !addFilter.fieldOptions?.clearField && existingCurrFilter
          ? existingCurrFilter
          : {
              fieldKey: addFilter.fieldKey,
              fieldTitle: filterField?.fieldTitle,
              values: [] as IOptionVal[],
            };

      const filterOptions: IOptionVal[] = await filterField?.options();
      const routineTplnrValues: string[] = [];
      for (const addFilterValue of addFilter.filterValues) {
        const newFilter = filterOptions?.find(
          (option) => option.value === addFilterValue
        );
        //  skip further processing for this value (no need to add to "warTplnr").
        if (addFilter.fieldKey === "warTplnr" && !newFilter) {
          routineTplnrValues.push(addFilterValue as string);
          continue;
        }

        if (
          currentFilter.values.some(
            (option) =>
              option.value === newFilter?.value &&
              option.isNotEqual === addFilter.fieldOptions?.isNotEqual
          )
        ) {
          // Skip if the value already exists in the current filter with the same "isNotEqual" flag
          continue;
        }
        newFilter &&
          currentFilter.values.push({
            ...newFilter,
            isNotEqual: addFilter.fieldOptions?.isNotEqual ?? false,
          });
      }

      if (existingFilterIndex === -1) {
        updatedFilters.push(currentFilter);
      } else {
        updatedFilters.splice(existingFilterIndex, 1, currentFilter);
      }
    }

    setSelectedFilters(updatedFilters);
  };

  const removeValueFromFilter = (
    filterKey: string,
    valuesToRemove: Array<string>
  ) => {
    const filters = selectedFilters.reduce(
      (result: IDashboardFiltersValue<GeneralDashboardTableRow>[], obj) => {
        if (obj.fieldKey === filterKey) {
          const updatedValues = obj.values.filter(
            (val) => !valuesToRemove.some((v) => v === val.value)
          );

          if (updatedValues.length > 0) {
            result.push({ ...obj, values: updatedValues });
          }
        } else {
          result.push(obj);
        }
        return result;
      },
      []
    );

    setSelectedFilters(filters);
  };

  const getOptionsFromColumn = (
    colKeys: (keyof GeneralDashboardTableRow)[]
  ): IOptionVal[] => {
    const valueTextMap = {} as Record<string, string>; // Single object for uniqueness + text

    dashboardEquipments.forEach((curr) => {
      const value = curr[colKeys[0]] as string;
      if (!value) return;

      let text: string;
      if (["ugda", "utzva"].includes(colKeys[0])) {
        text = curr[colKeys[1]] as string;
      } else if (["pikud"].includes(colKeys[0])) {
        const operLabel = orgTree
          ? orgTree[OrgLevelCode.TREE_TYPE][0]?.label
          : "";
        text =
          curr[colKeys[1]]
            ?.toString()
            .replace(operLabel ?? "", "")
            .replace("-", "") ?? "";
      } else {
        text = colKeys.map((k) => curr[k] as string).join(" - ");
      }

      if (!valueTextMap[value]) {
        valueTextMap[value] = text; // Store both value and text in one step
      }
    });

    return Object.keys(valueTextMap)
      .map((value) => ({
        text: valueTextMap[value],
        value,
      }))
      .sort((a, b) => a.value.localeCompare(b.value));
  };
  const filterKshirut: IOptionVal[] = params.kshirut
    .slice(0, 2)
    .map((option) => ({
      text: option.label,
      value: option.value,
    }))
    .concat([{ text: "לא דווח", value: "" }]);

  const filterList: IFilterStructure<GeneralDashboardTableRow>[] = useMemo(
    () => [
      {
        id: "1",
        category: 'אמל"ח',
        children: [
          {
            id: "1.1",
            category: "כשירויות",
            children: [
              {
                id: "1.1.1",
                fieldKey: "warKshirut",
                fieldTitle: "כשירות מלחמה",
                fieldType: FieldType.Checkbox,
                options: async () => filterKshirut,
              },
              {
                id: "1.1.2",
                fieldKey: "kshirut",
                fieldTitle: "כשירות שגרה",
                fieldType: FieldType.Checkbox,
                options: async () => filterKshirut,
              },
            ],
          },
          {
            id: "1.2",
            category: "מצב מבצעי",
            children: [
              {
                id: "1.2.1",
                fieldKey: "isGdudManeuvering",
                fieldTitle: "מצב מלחמה גדוד",
                fieldType: FieldType.Checkbox,
                options: async () => [
                  { text: "בלחימה", value: true },
                  { text: "לא בלחימה", value: false },
                ],
              },
              {
                id: "1.2.2",
                fieldKey: "equipmentTask",
                fieldTitle: "משימת כלי",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "equipmentTask"),
              },
            ],
          },
          {
            id: "1.3",
            category: "שיוך ארגוני",
            children: [
              {
                id: "1.3.1",
                fieldKey: "pikud",
                fieldTitle: "פיקוד",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["pikud", "pikudDesc"]),
              },
              {
                id: "1.3.2",
                fieldKey: "ugda",
                fieldTitle: "אוגדה",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["ugda", "ugdaDesc"]),
              },
              {
                id: "1.3.3",
                fieldKey: "utzva",
                fieldTitle: "חטיבה",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["utzva", "utzvaDesc"]),
              },
              {
                id: "1.3.4",
                fieldKey: "routineTplnr",
                fieldTitle: "שיוך בשגרה",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getOptionsFromColumn(["routineTplnr", "routineTplnrDesc"]),
              },
              {
                id: "1.3.5",
                fieldKey: "warTplnr",
                fieldTitle: "ציוות קרבי",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getOptionsFromColumn([
                    "conclusiveWarTplnr",
                    "conclusiveWarTplnrDesc",
                  ]),
              },
              {
                id: "1.3.6",
                fieldKey: "pluga",
                fieldTitle: "פלוגה",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
            ],
          },
          {
            id: "1.4",
            category: 'סוג אמל"ח',
            children: [
              {
                id: "1.4.1",
                fieldKey: "materialFamily",
                fieldTitle: "משפחה",
                fieldType: FieldType.Checkbox,
                options: async () => getFamilyOptionsByLevel(HierLevel.Family),
              },
              {
                id: "1.4.2",
                fieldKey: "mainPlatform",
                fieldTitle: "פלטפורמה",
                fieldType: FieldType.Checkbox,
                options: async () =>
                  getFamilyOptionsByLevel(HierLevel.Platform),
              },
              {
                id: "1.4.3",
                fieldKey: "secPlatform",
                fieldTitle: "תת פלטפורמה",
                fieldType: FieldType.Checkbox,
                options: async () =>
                  getFamilyOptionsByLevel(HierLevel.SubPlatform),
              },
              {
                id: "1.4.4",
                fieldKey: "material",
                fieldTitle: "חומר",
                fieldType: FieldType.Checkbox,
                options: () => getMaterialsOptions(materials),
              },
              {
                id: "1.4.5",
                fieldKey: "equipment",
                fieldTitle: "מספר צ'",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["equipment"]),
              },
              {
                id: "1.4.6",
                fieldKey: "description",
                fieldTitle: "תיאור חומר",
                fieldType: FieldType.TextField,
                options: () => getOptionsFromColumn(["description"]),
              },
            ],
          },
          {
            id: "1.5",
            category: "תפקיד הכלי",
            children: [
              {
                id: "1.5.1",
                fieldKey: "isAgamForce",
                fieldTitle: 'מכפילי כח אג"מי',
                fieldType: FieldType.Checkbox,
                options: () => getOptionsForBoolean(),
              },
              {
                id: "1.5.2",
                fieldKey: "isLogisticForce",
                fieldTitle: "מכפיל כח לוגיסטי",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsForBoolean(),
              },
              {
                id: "1.5.3",
                fieldKey: "job",
                fieldTitle: "תפקיד/סימון הכלי",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
              {
                id: "1.5.4",
                fieldKey: "maamad",
                fieldTitle: "מעמד",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["maamad", "maamadDesc"]),
              },
              {
                id: "1.5.5",
                fieldKey: "purpose",
                fieldTitle: "יעוד",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["purpose", "purposeDesc"]),
              },
              {
                id: "1.5.6",
                fieldKey: "tags",
                fieldTitle: "תגית",
                fieldType: FieldType.Checkbox,
                options: async () => getFilterOptionsFromParams(params, "tags"),
              },
            ],
          },
          {
            id: "1.6",
            category: "מיקום",
            children: [
              {
                id: "1.6.1",
                fieldKey: "physicalLocation",
                fieldTitle: "מיקום פיזי",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "physicalLocation"),
              },
              {
                id: "1.6.2",
                fieldKey: "physicalLocationDetails",
                fieldTitle: "תאור מקום פיזי",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
            ],
          },
          {
            id: "1.7",
            category: "עדכונים",
            children: [
              // {
              //   id: "1.7.1",
              // },
              // need to add updated by
              // {
              //   id: "1.7.2",
              //   fieldKey: "updated by",
              //   fieldTitle: "תאור מקום פיזי",
              //   fieldType: FieldType.TextField,
              //   options: () => getOptionsEmpty(),
              // },
            ],
          },
        ],
      },
      {
        id: "2",
        category: "תקלות",
        children: [
          {
            id: "2.1",
            category: "פרטי תקלה",
            children: [
              {
                id: "2.1.1",
                fieldKey: "faultNum",
                fieldTitle: "מספר תקלה",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["faultNum"]),
              },
              {
                id: "2.1.2",
                fieldKey: "decidingNonKshirutCause",
                fieldTitle: "סיבת אי כשירות קובעת",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "decidingNonKshirutCause"),
              },
              {
                id: "2.1.3",
                fieldKey: "essence",
                fieldTitle: "מהות תקלה",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
              {
                id: "2.1.4",
                fieldKey: "createTimestamp",
                fieldTitle: "תאריך יצירה",
                fieldType: FieldType.DatePicker,
                options: () => getOptionsEmpty(),
                dateOptions: { maxDate: new Date() },
              },
              {
                id: "2.1.5",
                fieldKey: "changeTimestamp",
                fieldTitle: "תאריך שינוי אחרון",
                fieldType: FieldType.DatePicker,
                options: () => getOptionsEmpty(),
                dateOptions: { maxDate: new Date() },
              },
              {
                id: "2.1.6",
                fieldKey: "grindType",
                fieldTitle: "סוג שחיקה",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromParams(params, "grindType"),
              },
              {
                id: "2.1.7",
                fieldKey: "availabilityInhibitor",
                fieldTitle: "מעכבי זמינות",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "availabilityInhibitor"),
              },
              {
                id: "2.1.8",
                fieldKey: "note",
                fieldTitle: "הערה",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
            ],
          },
          {
            id: "2.2",
            category: "פרטי תיקון",
            children: [
              {
                id: "2.2.1",
                fieldKey: "expectedTime",
                fieldTitle: "צפי תיקון",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "expectedTime"),
              },
              {
                id: "2.2.2",
                fieldKey: "faultStatus",
                fieldTitle: "סטטוס",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "faultStatus"),
              },
              {
                id: "2.2.3",
                fieldKey: "dereg",
                fieldTitle: "דרג טיפול",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromParams(params, "dereg"),
              },
              {
                id: "2.2.4",
                fieldKey: "transportationType",
                fieldTitle: "סוג הובלה",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "transportationType"),
              },
              {
                id: "2.2.5",
                fieldKey: "mobileAbility",
                fieldTitle: "יכולת תנועה",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getFilterOptionsFromParams(params, "mobileAbility"),
              },
              {
                id: "2.2.6",
                fieldKey: "reqSquad",
                fieldTitle: "חוליה נדרשת",
                fieldType: FieldType.Checkbox,
                options: async () => {
                  const optionsParams = await getFilterOptionsFromParams(
                    params,
                    "reqSquad"
                  );
                  const optionsFromColumn = await getOptionsFromColumn([
                    "reqSquad",
                  ]);
                  return optionsParams.filter((i) =>
                    optionsFromColumn.find((j) => j.value === i.value)
                  );
                },
              },
              {
                id: "2.2.7",
                fieldKey: "squad",
                fieldTitle: "חוליה מוקצת",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["squad"]),
              },
              {
                id: "2.2.8",
                fieldKey: "contact",
                fieldTitle: "איש קשר",
                fieldType: FieldType.TextField,
                options: () => getOptionsEmpty(),
              },
              {
                id: "2.2.9",
                fieldKey: "equipment",
                fieldTitle: "מספר צ'",
                fieldType: FieldType.Checkbox,
                options: () => getOptionsFromColumn(["equipment"]),
              },
            ],
          },
          {
            id: "2.3",
            category: 'ח"ח ואמצעים',
            children: [
              {
                id: "2.3.1",
                fieldKey: "faultHh",
                fieldTitle: "חלקי חילוף",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getOptionsNumber<DashboardFault>(
                    "faultHh",
                    dashboardEquipments.map((fault) => ({
                      ...fault,
                      faultHh: fault.faultHh?.filter(
                        (matnr) => matnr.missingParts === MaterialTypes.Missing
                      ),
                    }))
                  ),
              },
            ],
          },
        ],
      },
    ],
    [params, orgTree, dashboardEquipments, materials]
  );

  const getAllFieldsFromStructure = (
    structure: IFilterStructure<GeneralDashboardTableRow>[]
  ): IFieldData<GeneralDashboardTableRow>[] => {
    let fields: IFieldData<GeneralDashboardTableRow>[] = [];
    for (const node of structure) {
      if (node.fieldKey) {
        fields.push({
          fieldKey: node.fieldKey,
          fieldTitle: node.fieldTitle!,
          fieldType: node.fieldType!,
          options: node.options!,
        });
      }
      if (node.children) {
        fields = fields.concat(getAllFieldsFromStructure(node.children));
      }
    }
    return fields;
  };

  const allFields = useMemo(
    () => getAllFieldsFromStructure(filterList),
    [filterList]
  );
  return {
    fields: filterList,
    addFilters,
    removeValueFromFilter,
    selectedFilters,
    setSelectedFilters,
    clearFilters,
  };
};

export default useDbdGeneralFilters;
