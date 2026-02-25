import { atom } from "recoil";
import { TopViewPathValue } from "../components/TopViewPath/TopViewPath";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";

export type OrgLevelPath = Record<
  Exclude<OrgLevelCode, OrgLevelCode.TREE_TYPE>,
  TopViewPathValue | null
>;

export const defaultOrgLevelPath: OrgLevelPath = {
  [OrgLevelCode.PIKUD]: {
    hierLevel: OrgLevelCode.PIKUD,
  },
  [OrgLevelCode.UGDA]: null,
  [OrgLevelCode.UTZVA]: null,
  [OrgLevelCode.GDUD]: null,
};


export const orgLevelPathState = atom<OrgLevelPath>({
  key: "orgLevelPathState",
  default: defaultOrgLevelPath,
});
