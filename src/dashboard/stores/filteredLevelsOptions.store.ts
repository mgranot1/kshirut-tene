import { atom } from "recoil";
import { LevelsOptions, OrgLevelCode } from "../types/dashboardOrgLevel.types";

export const emptyLevelsOptions: LevelsOptions = {
  [OrgLevelCode.TREE_TYPE]: null,
  [OrgLevelCode.PIKUD]: null,
  [OrgLevelCode.UGDA]: null,
  [OrgLevelCode.UTZVA]: null,
  [OrgLevelCode.GDUD]: null,
};

export const filteredLevelsOptionsState = atom<LevelsOptions>({
  key: "filteredLevelsOptionsState",
  default: emptyLevelsOptions,
});
