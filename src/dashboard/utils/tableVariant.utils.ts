import {
  MRT_ColumnOrderState,
  MRT_RowData,
  MRT_VisibilityState,
} from "material-react-table";
import { IVariant, IVariantBase, TableVariant, TableVariantBase, VariantType } from "../types/variant.types";

/*
~ function convertMRTColumnDataToVariantColumnOrder
    Takes an MRT table's columnOrder state of a table and returns a columnOrder filtered to only have 
    columns that are visible in order and remove MRT-library-specific columns.
*/
export function convertMRTColumnDataToVariantColumnOrder<T extends MRT_RowData>(
  columnOrder: MRT_ColumnOrderState,
  columnVisibility?: MRT_VisibilityState
): (keyof T)[] {
  return columnOrder.filter((currColumn) => {
    if (currColumn.startsWith("mrt")) {
      return false;
    }

    const isCurrColumnVisible: boolean = columnVisibility?.[currColumn] ?? true;
    if (!isCurrColumnVisible) {
      return false;
    }

    return true;
  });
}

export function convertIVariantToTableVariant<T extends MRT_RowData>( variant: IVariant, tableId?: string) : TableVariant<T> ;
export function convertIVariantToTableVariant<T extends MRT_RowData>( variant: IVariantBase, tableId?: string,) : TableVariantBase<T>;
export function convertIVariantToTableVariant<T extends MRT_RowData>(
  variant: IVariant | IVariantBase,
): TableVariant<T> | TableVariantBase<T> {
  const variantValuesMap = Object.fromEntries(variant.values.map( variantValue => [ variantValue.field, variantValue.value ] ));
  const tableId = variantValuesMap["tableId"];

  if(!tableId) {
    throw "Could not assign a table to the given table-variant"
  }

  const tableVariantValues: Pick<TableVariantBase<T>, "values"> = {
    values: {
      ...variantValuesMap,
      tableId,
      columnOrder: variantValuesMap["columnOrder"] == "" ? [] : variantValuesMap["columnOrder"]?.split(",") ?? undefined // columnOrder is recieved as a string from the variant type, as it should, but it is suppposed an array for the table-variant type
    },
  };

  return {...variant, ...tableVariantValues, type: VariantType.table};
}

export function convertTableVariantToIVariant<T extends MRT_RowData>(tableVariant: TableVariant<T>) : IVariant ;
export function convertTableVariantToIVariant<T extends MRT_RowData>(tableVariant: TableVariantBase<T>) : IVariantBase ;
export function convertTableVariantToIVariant<T extends MRT_RowData>(
  tableVariant: TableVariantBase<T>| TableVariant<T>
): IVariantBase | IVariant {
  const variantValues: Pick<IVariant, "values"> = {
    values: [
        ...Object.entries(tableVariant.values).map(([field,value]) => {
            if (typeof value == 'string') {
                return ({field, value})
            } 
            if (Array.isArray(value)) {
                return {field, value: value.join(',')}
            }
            return {field: '', value: ''}
        }).filter(nonEmptyValues => nonEmptyValues.field !== '')
    ]
  };

  return { ...tableVariant, ...variantValues, type: VariantType.table };
}