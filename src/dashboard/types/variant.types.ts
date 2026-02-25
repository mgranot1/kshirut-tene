import { MRT_RowData } from "material-react-table";

export enum VariantType {
  dynamicChart = 1,
  global,
  table,
  layout,
}

export interface IVariantValue {
  field: string;
  value: string;
}

export interface IVariantConfiguration {
  variantDescription: string;
  type: number;
  isGlobal: boolean;
  isDefault: boolean;
}
export interface IVariantValues {
  values: IVariantValue[];
}
export type IVariantBase = IVariantConfiguration & IVariantValues;
export type IVariant = { variantId: number } & IVariantBase;
export type IGeneralVariant = { variantId: number } & IVariantConfiguration;

export type TableVariantValues<T extends MRT_RowData> = {
  tableId: string;
  columnOrder?: (keyof T)[];
};
export type TableVariantBase<T extends MRT_RowData> = IVariantConfiguration & {
  values: TableVariantValues<T>;
};
export type TableVariant<T extends MRT_RowData> = {
  variantId: number;
} & TableVariantBase<T>;
