import { Drilltype } from "../pages/CustomScreen/CustomScreen";
import {
  FilterOrgLevel,
  FilterType,
  IComponentFilter,
} from "../types/componentFilter.types";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";
import { MaterialDescription } from "../types/material.types";

const groupedFilters = (filters: IComponentFilter[], filtersKeys: string[]) => {
  return filters
    .filter((f) => filtersKeys.includes(f.field))
    .reduce((acc, f) => {
      if (!acc[f.field]) acc[f.field] = [];
      acc[f.field].push(f.value);
      return acc;
    }, {});
};

export const isEndOfLevels = (
  filters: IComponentFilter[],
  drillBy: Drilltype,
  materials: MaterialDescription[]
): boolean => {
  if (drillBy === Drilltype.ByFamily) {

    const groupedByFamilyLevel = groupedFilters(filters, [
      FilterType.MaterialFamily,
      FilterType.MainPlatform,
      FilterType.SecPlatform,
      FilterType.Material
    ]);

    const family: string[] =
      groupedByFamilyLevel[FilterType.MaterialFamily] ?? [];
    const mainPlatform: string[] =
      groupedByFamilyLevel[FilterType.MainPlatform] ?? [];
    const secPlatform: string[] =
      groupedByFamilyLevel[FilterType.SecPlatform] ?? [];
    const material: string[] =
      groupedByFamilyLevel[FilterType.Material] ?? [];

    // Disable drill by family when i have one hierarcy with one leaf (material)
    if (material.length === 1) {
      const materialParent = materials.find(mtnr => mtnr.material === material[0])?.parentCode!!;

      if ((secPlatform.length === 0 ||
          (secPlatform.length === 1 &&
            secPlatform[0] === materialParent
          )) &&
        (mainPlatform.length === 0 ||
          (mainPlatform.length === 1 &&
            materialParent.startsWith(mainPlatform[0]))) &&
        (family.length === 0 ||
          (family.length === 1 && materialParent.startsWith(family[0])))) {
        return true;
      }
    }
    return false;
  } else if (drillBy === Drilltype.ByOrgLevel) {
    const groupedByTsav = groupedFilters(filters, [
      FilterOrgLevel[OrgLevelCode.PIKUD],
      FilterOrgLevel[OrgLevelCode.UGDA],
      FilterOrgLevel[OrgLevelCode.UTZVA],
      FilterOrgLevel[OrgLevelCode.GDUD],
    ]);

    // Disable drill by tsav irgun when i have one tsav with one leaf (gdud)
    if (
      groupedByTsav[FilterOrgLevel[OrgLevelCode.GDUD]]?.length === 1 &&
      groupedByTsav[FilterOrgLevel[OrgLevelCode.UTZVA]]?.length === 1 &&
      groupedByTsav[FilterOrgLevel[OrgLevelCode.UGDA]]?.length === 1 &&
      groupedByTsav[FilterOrgLevel[OrgLevelCode.PIKUD]]?.length === 1
    )
      return true;
    return false;
  }
  return false;
};
