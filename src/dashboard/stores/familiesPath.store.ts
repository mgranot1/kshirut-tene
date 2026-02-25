import { atom } from "recoil";
import { TopViewPathValue } from "../components/TopViewPath/TopViewPath";
import { HierLevel } from "../types/family.types";

export type FamilyPath = Record<
  Exclude<HierLevel, HierLevel.All>,
  TopViewPathValue | null
>;

export const familyLevelDesc: Record<Exclude<HierLevel, HierLevel.All>, string> = {
  [HierLevel.Family]: "משפחות",
  [HierLevel.Platform]: "פלטפורמות",
  [HierLevel.SubPlatform]: "תת פלטפורמות",
  [HierLevel.Material]: "חומרים",  
};

export const defaultFamiliesPath: FamilyPath = {
  [HierLevel.Family]: {
    hierLevel: HierLevel.Family,
  },
  [HierLevel.Platform]: null,
  [HierLevel.SubPlatform]: null,
  [HierLevel.Material]: null,
};

export const familiesPathState = atom<FamilyPath>({
  key: "familiesPathState",
  default: defaultFamiliesPath,
});
