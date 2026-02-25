import { MRT_ColumnDef, MRT_RowData } from "material-react-table";
import { useRecoilValue } from "recoil";
import { paramsAtom } from "../../shared/stores/params.store";
import { IOption } from "../../shared/types/general.types";
import { dashboardEquipmentRowKeys } from "../types/generalTable.types";
import { ExcelColumn, handleExcelExport } from "../utils/excel.utils";

export type convertTableRecordValueToCellValueT = <T extends MRT_RowData>(
  record: T,
  excelColumnKey: ExcelColumn["key"]
) => string;

const useTableExportToExcel = <T extends MRT_RowData>(
  customConvertTableRecordValueToCellValue?: convertTableRecordValueToCellValueT
) => {
  const params = useRecoilValue(paramsAtom);

  const convertTableRecordValueToCellValue = (
    record: T,
    excelColumnKey: ExcelColumn["key"]
  ): string => {
    if (customConvertTableRecordValueToCellValue)
      return customConvertTableRecordValueToCellValue(record, excelColumnKey);
    if (excelColumnKey && params[excelColumnKey]) {
      return params[excelColumnKey].find(
        (option: IOption) => option.value === record[excelColumnKey as keyof T]
      )?.label;
    }
    return record[excelColumnKey];
  };

  const createColumnsForExcel = (
    tableColumns: MRT_ColumnDef<T, unknown>[],
    recordsKeys: string[]
  ): ExcelColumn[] => {
    const excelColumns: ExcelColumn[] = tableColumns.map((column) => {
      const key = column.id || column.accessorKey;
      if (!key) {
        throw new Error("A dashboard column without a key/id");
      }

      const columnDesc = `${column.id}Desc`;

      return {
        key: recordsKeys.includes(columnDesc) ? columnDesc : column.id || "",
        title: column.header,
        // @ts-ignore
        mergeIt: dashboardEquipmentRowKeys.includes(key),
      };
    });

    return excelColumns;
  };

  const handleTableExcelExport = (
    fileName: string,
    dataToExport: T[],
    columns: MRT_ColumnDef<T, unknown>[],
    columnKeyToMergeBy: string
  ) =>
    handleExcelExport(
      dataToExport,
      columns,
      createColumnsForExcel,
      convertTableRecordValueToCellValue,
      columnKeyToMergeBy,
      fileName
    );

  return { handleTableExcelExport };
};

export default useTableExportToExcel;
