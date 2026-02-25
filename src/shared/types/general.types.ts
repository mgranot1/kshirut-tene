import { ReactNode } from "react";

export type TurnOptional<T extends Object, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export interface ServerKeyValue {
  fieldname: string;
  key: string;
  value: string;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IDropDownOption {
  label: string | ReactNode;
  value: string | number | boolean | object;
}

export function isIOption(obj: any): obj is IOption {
  return (
    typeof obj === "object" ||
    ((!!(obj as IOption).label || (obj as IOption).label === "") &&
      (!!(obj as IOption).value || (obj as IOption).value === ""))
  );
}
