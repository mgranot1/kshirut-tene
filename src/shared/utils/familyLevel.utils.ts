import { FamilyPath } from "../../dashboard/stores/familiesPath.store";

export const findFamilyDetails = (familiesPath: FamilyPath) => {
  const keys = Object.keys(familiesPath);

  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i];
    const element = familiesPath[key];

    if (element && 'code' in element) {
      return element;
    }
  }
  return null;
}