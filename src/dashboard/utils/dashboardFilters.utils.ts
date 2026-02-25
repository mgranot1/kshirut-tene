import { SetterOrUpdater } from "recoil";
import {
  IDashboardFiltersValue,
  IFieldData,
  IOptionVal,
} from "../types/filters.types";

export const getOptionsForBoolean = () => {
  return Promise.all([
    { text: "כן", value: true },
    { text: "לא", value: false },
  ]);
};

export const getOptionsEmpty = () => {
  return Promise.all([]);
};

export type filterHookReturn<T> = {
  fields: IFieldData<T>[];
  addFilters: (
    fieldKey: keyof T,
    ...filterValue: string[] | Date[] | boolean[] | number[]
  ) => void;
  selectedFilters: IDashboardFiltersValue<T>[];
  setSelectedFilters: SetterOrUpdater<IDashboardFiltersValue<T>[]>;
};

export function getOptionsFromColumn<T>(colKeys: keyof T, data: T[]) {
  return Promise.all(
    data
      .reduce((acc: IOptionVal[], curr: T) => {
        const value = curr[colKeys] as string;
        const label = (curr[colKeys] as string).replace(/^0+/, "");
        if (!value) return acc;
        if (!acc.find((opt) => opt.value === value))
          acc.push({ text: label, value: value });
        return acc;
      }, [])
      .sort((a, b) => (a.value > b.value ? 1 : -1))
  );
}

export function getOptionsNumber<T>(colKeys: keyof T, data: T[]) {
  return Promise.all(
    data
      .reduce((acc: IOptionVal[], curr: T) => {
        const currArray = curr[colKeys];
        let val = Array.isArray(currArray) ? currArray.length : 0;
        if (!acc.find((opt) => opt.value === val))
          acc.push({ text: val.toString(), value: val });
        return acc;
      }, [])
      .sort((a, b) => (a.value > b.value ? 1 : -1))
  );
}
