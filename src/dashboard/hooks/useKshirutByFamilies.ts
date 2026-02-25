import { HierLevel, IFamily } from "../types/family.types";

export type familyNameAndKshirutAmount = {
  familyCode: IFamily["code"];
  familyName: IFamily["description"];
  amountAll: number;
  amountNotKashir: number;
};

export const useKshirutByFamilies = (families: IFamily[]) => {
  const getFamiliesByLevelAndFilter = (
    filterValue: string[],
    familyLevel: Number
  ): string[] => {
    return Array.from(
      new Set(filterValue.map((f) => f.slice(0, Number(familyLevel) * 3 - 1)))
    );
  };

  const filteredFamilies = (
    filterValue: string[],
    familyLevel: string
  ): IFamily[] => {
    if (familyLevel === HierLevel.All) {
      return families.filter((family) => family.hierLevel === HierLevel.Family);
    }

    const codes = getFamiliesByLevelAndFilter(
      filterValue,
      Number(familyLevel) + 1
    );
    return families.filter((family) => codes.includes(family.code));
  };

  return {
    filteredFamilies,
    getFamiliesByLevelAndFilter,
  };
};
