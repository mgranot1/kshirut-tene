import { atom } from "recoil";
import { HierLevel } from "../../types/dashboard/family.types";
import { FamilyPath } from "./familiesPath.store";

export const familyLevelDesc = {
  [HierLevel.Family]: "משפחות",
  [HierLevel.Platform]: "פלטפורמות",
  [HierLevel.SubPlatform]: "תת פלטפורמות",
};

export const defaultPath = {
  [HierLevel.Family]: {
    hierLevel: HierLevel.Family,
  },
  [HierLevel.Platform]: null,
  [HierLevel.SubPlatform]: null,
};

export const topViewPathState = atom<FamilyPath>({
  key: "topViewPathState",
  default: defaultPath,
});
