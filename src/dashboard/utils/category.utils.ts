import { IOption } from "../../shared/types/general.types";
import { ICategory } from "../types/category.types";

export const getCategoryOptions = (categories: ICategory[]): IOption[] => {
  return categories.map((category) => ({
    label: `${category.name} `,
    value: category.id,
  }));
};
