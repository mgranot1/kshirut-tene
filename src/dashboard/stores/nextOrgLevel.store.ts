import { atom } from "recoil";
import { ITsavIrgunLevel } from "../../shared/types/tsavIrgun.types";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";

export type OrgLevelOptions = {
  levelCode: OrgLevelCode;
  options: ITsavIrgunLevel[] | null;
};

export const nextOrgLevelState = atom<OrgLevelOptions>({
  key: "nextOrgLevelState",
  default: {} as OrgLevelOptions,
});
