import { isEqual, omit } from "lodash";

export const AreObjectsTheSame = <T extends object>(
  obj1: T,
  obj2: T,
  excludeFields: (keyof T)[] = []
): boolean => {
  return isEqual(omit(obj1, excludeFields), omit(obj2, excludeFields));
};
export const AreArraysTheSame = <T extends object>(
  arr1: T[],
  arr2: T[],
  excludeFields: (keyof T)[] = []
): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (!AreObjectsTheSame(arr1[i], arr2[i], excludeFields)) return false;
  }

  return true;
};
