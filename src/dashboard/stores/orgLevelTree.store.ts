import { atom } from "recoil";
import { ORG_LEVEL_KEY } from "../../shared/utils/constants";
import { OrganizationalLevel } from "../types/dashboardOrgLevel.types";
import { localStorageEffect } from "../utils/dashboardData.utils";

export const orgTreeAtom = atom<OrganizationalLevel | undefined>({
  key: ORG_LEVEL_KEY,
  default: undefined,
  effects: [localStorageEffect<OrganizationalLevel>(ORG_LEVEL_KEY)],
});
