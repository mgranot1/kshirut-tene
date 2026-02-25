import { useRecoilValue } from "recoil";
import { familiesListState } from "../stores/families.store";
import { HierLevel } from "../types/family.types";

export const useFamiliesOptions = () => {
  const families = useRecoilValue(familiesListState);

  const getFamilyOptionsByLevel = (level: HierLevel) => {
    const options = families
      .filter((f) => f.hierLevel === level)
      .map((f) => ({
        label: f.description,
        value: f.code,
        text: f.description,
      }));

    return options;
  };

  return { getFamilyOptionsByLevel };
};
