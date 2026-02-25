import { IOption } from "../../shared/types/general.types";
import { ITsavIrgunLevel } from "../../shared/types/tsavIrgun.types";

export enum OrgLevelCode {
  TREE_TYPE = 0,
  PIKUD,
  UGDA,
  UTZVA,
  GDUD,
}

// an array of all OrgLevelCode: 0,1,2,3,4 currently
export const OrgLevelCodeKeys: OrgLevelCode[] = Object.values(
  OrgLevelCode
).slice(
  Object.values(OrgLevelCode).length / 2,
  Object.values(OrgLevelCode).length
) as OrgLevelCode[];

export const levelsData = {
  [OrgLevelCode.TREE_TYPE]: { placeholder: "סוג העץ", title: "עץ" },
  [OrgLevelCode.PIKUD]: { placeholder: "כל הפיקודים", title: "פיקוד" },
  [OrgLevelCode.UGDA]: { placeholder: "כל האוגדות", title: "אוגדה" },
  [OrgLevelCode.UTZVA]: { placeholder: "כל החטיבות", title: "חטיבה" },
  [OrgLevelCode.GDUD]: { placeholder: "כל הגדודים", title: "גדוד" },
};

export type OrganizationalLevel = {
  [OrgLevelCode.TREE_TYPE]: IOption[];
  [OrgLevelCode.PIKUD]: IOption[];
  [OrgLevelCode.UGDA]: IOption[];
  [OrgLevelCode.UTZVA]: IOption[];
  [OrgLevelCode.GDUD]: IOption[];
};

export type LevelsOptions = {
  [OrgLevelCode.TREE_TYPE]: ITsavIrgunLevel[] | null;
  [OrgLevelCode.PIKUD]: ITsavIrgunLevel[] | null;
  [OrgLevelCode.UGDA]: ITsavIrgunLevel[] | null;
  [OrgLevelCode.UTZVA]: ITsavIrgunLevel[] | null;
  [OrgLevelCode.GDUD]: ITsavIrgunLevel[] | null;
};

export const emptyOrganizationalLevel: OrganizationalLevel = {
  [OrgLevelCode.TREE_TYPE]: [],
  [OrgLevelCode.PIKUD]: [],
  [OrgLevelCode.UGDA]: [],
  [OrgLevelCode.UTZVA]: [],
  [OrgLevelCode.GDUD]: [],
};
