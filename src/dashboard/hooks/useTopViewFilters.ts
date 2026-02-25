import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { paramsAtom } from "../../shared/stores/params.store";
import {
  ITsavIrgunLevel,
  TsavIdentifier,
} from "../../shared/types/tsavIrgun.types";
import {
  findTsavsInOptions,
  getLevelCodeFromSelectedTsav,
  getTsavIdentifier,
  isEmergencyTree,
} from "../../shared/utils/orgLevel.utils";
import { useGetMaterials } from "../services/material/useGetMaterials";
import { topViewFiltersState } from "../stores/DashFilters.store";
import { filteredLevelsOptionsState } from "../stores/filteredLevelsOptions.store";
import { orgTreeAtom } from "../stores/orgLevelTree.store";
import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../types/dashboardOrgLevel.types";
import { HierLevel } from "../types/family.types";
import { FieldType, IOptionVal } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";
import { GdudFilters, TopViewDynamicFilters } from "../types/topview.types";
import { getOptionsEmpty } from "../utils/dashboardFilters.utils";
import {
  getFilterOptionsFromParams,
  getMaterialsOptions,
} from "../utils/equipmentsFilters.util";
import { IFilterStructure } from "./useDbdFilters";
import { useFamiliesOptions } from "./useFamiliesOptions";

export type UseTopViewFiltersProps = TopViewDynamicFilters | undefined;

export const useTopViewFilters = (props?: UseTopViewFiltersProps) => {
  const params = useRecoilValue(paramsAtom);
  const filteredLevelsOptions = useRecoilValue(filteredLevelsOptionsState);
  const orgTree: OrganizationalLevel | undefined = useRecoilValue(orgTreeAtom);
  const currentSelectedLevel = orgTree
    ? getLevelCodeFromSelectedTsav(orgTree)
    : 0;

  const { getFamilyOptionsByLevel } = useFamiliesOptions();
  const { data: materials } = useGetMaterials();

  const [selectedFilters, setSelectedFilters] =
    useRecoilState(topViewFiltersState);

  const getFilterOptionsFromTsavTree = async (
    level: OrgLevelCode
  ): Promise<IOptionVal[]> => {
    if (!orgTree) {
      return [];
    }

    const isEmergency = isEmergencyTree(orgTree);
    const relevantKey: TsavIdentifier =
      level === OrgLevelCode.GDUD ? "funcLoc" : getTsavIdentifier(isEmergency);
    const objidToFilterForm = (objid: string) => String(objid).padStart(8, "0"); // objid from filteredLevelOptions is in number type. For filters it should be a padded string.

    if (level <= currentSelectedLevel) {
      const tsav = findTsavsInOptions(
        filteredLevelsOptions[level],
        orgTree[level].map((o) => o.value),
        isEmergency
      )?.[0];

      return tsav
        ? [
          {
            text: tsav.funcLocDesc,
            value:
              relevantKey == "objid"
                ? objidToFilterForm(tsav[relevantKey])
                : tsav[relevantKey],
          },
        ]
        : [];
    }

    const relevantTsavs: ITsavIrgunLevel[] | null =
      filteredLevelsOptions[level];

    if (!relevantTsavs) return [];

    return relevantTsavs.map((tsav) => ({
      text: tsav.funcLocDesc,
      value:
        relevantKey == "objid"
          ? objidToFilterForm(tsav[relevantKey])
          : tsav[relevantKey],
    }));
  };

  const getGdudimFilterOptions = async (
    gdudFilters:
      | GdudFilters["routineGdudFilters"]
      | GdudFilters["warGdudFilters"]
      | undefined
  ): Promise<IOptionVal[]> => {
    if (gdudFilters) {
      return gdudFilters?.map((option) => ({
        value: option.key,
        text: `${option.key} - ${option.value}`,
      }));
    }

    return getFilterOptionsFromTsavTree(OrgLevelCode.GDUD);
  };

  const fields: IFilterStructure<GeneralDashboardTableRow>[] = useMemo(
    () => [
      {
        id: "1",
        category: 'אמל"ח',
        isExpanded: true,
        children: [
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
                options: () => getFilterOptionsFromTsavTree(OrgLevelCode.PIKUD),
              },
              {
                id: "1.3.2",
                fieldKey: "ugda",
                fieldTitle: "אוגדה",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromTsavTree(OrgLevelCode.UGDA),
              },
              {
                id: "1.3.3",
                fieldKey: "utzva",
                fieldTitle: "חטיבה",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromTsavTree(OrgLevelCode.UTZVA),
              },
              {
                id: "1.3.4",
                fieldKey: "routineTplnr",
                fieldTitle: "שיוך בשגרה",
                fieldType: FieldType.Checkbox,
                options: () =>
                  getGdudimFilterOptions(props?.routineGdudFilters),
              },
              {
                id: "1.3.5",
                fieldKey: "warTplnr",
                fieldTitle: "ציוות קרבי",
                fieldType: FieldType.Checkbox,
                options: () => getGdudimFilterOptions(props?.warGdudFilters),
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
            ],
          },
          {
            id: "1.5",
            category: "תפקיד הכלי",
            children: [
              {
                id: "1.5.4",
                fieldKey: "maamad",
                fieldTitle: "מעמד",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromParams(params, "maamad"),
              },
              {
                id: "1.5.5",
                fieldKey: "purpose",
                fieldTitle: "יעוד",
                fieldType: FieldType.Checkbox,
                options: () => getFilterOptionsFromParams(params, "purpose"),
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
        ],

      },
    ],
    [params, filteredLevelsOptions, orgTree, props]
  );

  return {
    fields,
    selectedFilters,
    setSelectedFilters,
  };
};

export default useTopViewFilters;
