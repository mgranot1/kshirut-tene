import { StaticDatePickerProps } from "@mui/x-date-pickers";

export interface IFilterOption {
  optionTitle: string;
  optionValue: string | boolean | Date | number;
  isSelected: boolean;
  isNotEqual?: boolean;
}

export interface IOptionVal {
  text: string;
  value: string | boolean | Date | number;
  isNotEqual?: boolean;
}

export interface IFilterField<T> {
  fieldKey: keyof T;
  fieldTitle: string;
  isExpanded: boolean;
  options: IFilterOption[];
  fieldType: FieldType;
  dateOptions?: Partial<StaticDatePickerProps<Date>>;
}
export interface IFieldData<T> {
  fieldKey: keyof T;
  fieldTitle: string;
  fieldType: FieldType;
  dateOptions?: Partial<StaticDatePickerProps<Date>>;
  options: () => IOptionVal[] | Promise<IOptionVal[]>;
}

export interface IDashboardFiltersValue<T> {
  fieldKey: keyof T;
  fieldTitle: string;
  values: IOptionVal[];
}

export enum FieldType {
  Checkbox,
  TextField,
  DatePicker,
}
