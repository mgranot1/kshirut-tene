import { TopViewPathValue } from "../../dashboard/components/TopViewPath/TopViewPath";
import { FamilyPath } from "../../dashboard/stores/familiesPath.store";
import { HierLevel } from "../../dashboard/types/family.types";

export const familyLevelDesc: Record<
  Exclude<HierLevel, HierLevel.All>,
  string
> = {
  [HierLevel.Family]: "משפחות",
  [HierLevel.Platform]: "פלטפורמות",
  [HierLevel.SubPlatform]: "תת פלטפורמות",
};

export const findLastValidFamilyPath = (familiesPath: FamilyPath): TopViewPathValue | null => {
  const levels = Object.keys(familiesPath).map(Number).sort((a, b) => b - a);

  for (const level of levels) {
    const pathValue = familiesPath[level];
    if (
      pathValue &&
      pathValue.code !== undefined &&
      pathValue.optionalDesc !== undefined
    ) {
      return pathValue;
    }
  }

  return null;
}