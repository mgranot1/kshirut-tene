import { atom, selector } from "recoil";
import {
  GENERAL_SELECTED_FILTERS_SESSION_KEY,
  TOP_VIEW_SELECTED_FILTERS_SESSION_KEY,
} from "../../shared/utils/constants";
import { DashboardEquipment } from "../types/EquipmentTable.types";
import { HierLevel } from "../types/family.types";
import { IDashboardFiltersValue } from "../types/filters.types";
import { GeneralDashboardTableRow } from "../types/generalTable.types";
import { sessionStorageEffect } from "../utils/dashboardData.utils";
import { familiesListState } from "./families.store";

export const topViewFiltersState = atom<
  IDashboardFiltersValue<GeneralDashboardTableRow>[]
>({
  key: "topViewFiltersState",
  default: [] as IDashboardFiltersValue<GeneralDashboardTableRow>[],
  effects: [
    sessionStorageEffect<DashboardEquipment>(
      TOP_VIEW_SELECTED_FILTERS_SESSION_KEY
    ),
  ],
});

export const generalFiltersState = atom<
  IDashboardFiltersValue<GeneralDashboardTableRow>[]
>({
  key: "generalfiltersState",
  default: [] as IDashboardFiltersValue<GeneralDashboardTableRow>[],
  effects: [
    sessionStorageEffect<GeneralDashboardTableRow>(
      GENERAL_SELECTED_FILTERS_SESSION_KEY
    ),
  ],
});

export interface IFamilyType {
  codes: string[];
  level: HierLevel;
}

interface IFamilyFields {
  fieldKey: keyof GeneralDashboardTableRow;
  fieldLevel: HierLevel;
}

export const minimalFamily = selector<IFamilyType>({
  key: "minimalFamily",
  get: ({ get }) => {
    const familyFields: IFamilyFields[] = [
      { fieldKey: "materialFamily", fieldLevel: HierLevel.Family },
      { fieldKey: "mainPlatform", fieldLevel: HierLevel.Platform },
      { fieldKey: "secPlatform", fieldLevel: HierLevel.SubPlatform },
    ];

    let minimalFam: IFamilyType = { codes: [], level: HierLevel.Family };
    const filterVals = get(generalFiltersState);
    const minimalFamilyLevel = Math.max.apply(
      Math,
      familyFields
        .filter((i) => filterVals.map((h) => h.fieldKey).includes(i.fieldKey))
        .map((j) => Number(j.fieldLevel))
    );

    const families = get(familiesListState);
    if (minimalFamilyLevel < 0) {
      return {
        codes: families
          .filter((f) => f.hierLevel === HierLevel.SubPlatform)
          .map((f) => f.code),
        level: HierLevel.All,
      };
    }

    const getSubPlatform = (
      familiesCodes: string[],
      fieldLevel: string
    ): string[] => {
      if (fieldLevel === HierLevel.SubPlatform) {
        return familiesCodes;
      }
      return families
        .filter(
          (familiy) =>
            familiy.hierLevel === HierLevel.SubPlatform &&
            familiesCodes.includes(
              familiy.code.slice(0, Number(fieldLevel) * 3 - 1)
            )
        )
        .map((i) => i.code);
    };

    familyFields.forEach((ff) => {
      const familyVal = filterVals.find((fil) => fil.fieldKey === ff.fieldKey);
      let familyCodes: string[] = [];
      if (familyVal) {
        familyCodes = getSubPlatform(
          familyVal.values.map((i) => i.value as string),
          ff.fieldLevel
        );
      }
      minimalFam = {
        codes: minimalFam.codes.concat(familyCodes),
        level: String(minimalFamilyLevel) as HierLevel,
      };
    });

    return minimalFam;
  },
});
