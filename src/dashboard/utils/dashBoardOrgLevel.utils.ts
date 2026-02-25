import {
  OrganizationalLevel,
  OrgLevelCode,
} from "../types/dashboardOrgLevel.types";

export const getLastItemFromTree = (
  orgTree: OrganizationalLevel | undefined
) => {
  return orgTree && orgTree[OrgLevelCode.PIKUD].length > 0
    ? (Object.values(orgTree)
        .splice(1)
        .filter((tsav) => tsav.length > 0)
        .reverse()[0][0]?.value ?? "")
    : undefined;
};
