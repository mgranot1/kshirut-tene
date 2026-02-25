import { IOption } from "../../shared/types/general.types";
import { FieldType } from "./filters.types";

export interface ISearchField {
  fieldKey: string;
  fieldTitle: string;
  options: () => IOption[];
  fieldType: FieldType;
}
export interface SearchFields {
  screenName: string;
  screenId: string;
  categoryIds: string[];
  creators: string[];
}
