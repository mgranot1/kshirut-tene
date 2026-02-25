import { Range, utils, WorkBook, WorkSheet, writeFile } from "xlsx";
import { IOption } from "../../shared/types/general.types";
import { ColumnOrderState } from "@tanstack/table-core";

const DEFUALT_COLUMN_WIDTH = 20;

export type ExcelRow = {
  [key: string]: string;
};

export type ExcelColumn = {
  key: string;
  title: string;
  mergeIt: boolean;
};

export type TableColumn = {
  id?: string;
  accessorKey?: string;
  header?: string;
};

export type CreateColumnsForExcel<C> = (
  tableColumns: C[],
  recordsKeys: string[],
  columnOrder?:ColumnOrderState
) => ExcelColumn[];

export type ConvertTableRecordToExcelRow<R> = (
  record: R,
  excelColumns: ExcelColumn[]
) => ExcelRow;

// TODO: change excelColumn to excelColumnKey
export type ConvertTableRecordValueToCellValue<R> = (
  record: R,
  excelColumnKey: ExcelColumn["key"]
) => string;

export const exportToFile = (data: ExcelRow[], fileName: string) => {
  const worksheet: WorkSheet = utils.json_to_sheet(data);
  const workbook: WorkBook = utils.book_new();



  if (!workbook.Workbook) workbook.Workbook = {};
  if (!workbook.Workbook.Views) workbook.Workbook.Views = [];
  if (!workbook.Workbook.Views[0]) workbook.Workbook.Views[0] = {};
  workbook.Workbook.Views[0].RTL = true;

  utils.book_append_sheet(workbook, worksheet, fileName);
  writeFile(workbook, `${fileName}.xlsx`);
};

const convertTableRecordToExcelRow = <R extends object>(
  record: R,
  excelColumns: ExcelColumn[],
  convertTableRecordValueToCellValue: ConvertTableRecordValueToCellValue<R>
): ExcelRow => {
  const excelRow: ExcelRow = excelColumns.reduce((excelRow, excelColumn) => {
    const cellValue: string = convertTableRecordValueToCellValue(
      record,
      excelColumn.key
    );

    excelRow[excelColumn.title] = cellValue;
    return excelRow;
  }, {} as ExcelRow);

  return excelRow;
};

type RowIndexesRange = {
  start: number;
  end: number;
};

type RowIndexesPerKey = {
  [key: string]: number[];
};

const makeMerges = <R extends object, C extends TableColumn>(
  excelColumns: ExcelColumn[],
  sortedRecords: R[],
  columnKeyToMergeBy: keyof R
): Range[] => {
  const rowIndexStart = 1;
  const columnIndexStart = 0;

  // get row indexes for each PK instance. eg: {"0050132": [56,57,58,59], "1234650": [60]}
  const rowIndexesPerKey: RowIndexesPerKey =
    sortedRecords.reduce<RowIndexesPerKey>(
      (acc: RowIndexesPerKey, curr: R, rowIndex: number) => {
        const rowId: string = curr[columnKeyToMergeBy] + "";

        if (Array.isArray(acc[rowId])) {
          acc[rowId].push(rowIndex);
        } else {
          acc[rowId] = [rowIndex];
        }

        return acc;
      },
      {}
    );

  // convert the row indexes per key to ranges. eg: [{s:56,e:59}, ...]
  const rowIndexesRanges: RowIndexesRange[] = Object.values(rowIndexesPerKey)
    .filter((rowIndexes) => rowIndexes.length > 1)
    .map((rowIndexes) => {
      return {
        start: rowIndexes[0],
        end: rowIndexes[rowIndexes.length - 1],
      };
    });

  // get the columns the relate to the PK,
  // aka the columns that has equal values in the indexes of rowIndexesRanges
  const columnIndexes: number[] = excelColumns
    .map((column, index) => {
      return column.mergeIt ? index : undefined;
    })
    .filter((index: number | undefined) => index !== undefined) as number[];

  const excelRanges: Range[] = [];

  // combine the two ranges types to make the ranges
  rowIndexesRanges.forEach((rowIndexes) => {
    columnIndexes.forEach((columnIndex) => {
      const excelIndexRange: Range = {
        s: {
          r: rowIndexes.start + rowIndexStart,
          c: columnIndex + columnIndexStart,
        },
        e: {
          r: rowIndexes.end + rowIndexStart,
          c: columnIndex + columnIndexStart,
        },
      };

      excelRanges.push(excelIndexRange);
    });
  });

  return excelRanges;
};

export const convertTableRecordsToExcelRows = <R extends object>(
  records: R[],
  excelColumns: ExcelColumn[],
  convertTableRecordValueToCellValue: ConvertTableRecordValueToCellValue<R>
): ExcelRow[] => {
  const rows: ExcelRow[] = records.map((record: R) => {
    const excelRow: ExcelRow = convertTableRecordToExcelRow(
      record,
      excelColumns,
      convertTableRecordValueToCellValue
    );
    return excelRow;
  });

  return rows;
};

const makeWorkBook = (worksheet: WorkSheet, fileName: string): WorkBook => {
  const workbook: WorkBook = utils.book_new();
  if (!workbook.Workbook) workbook.Workbook = {};
  if (!workbook.Workbook.Views) workbook.Workbook.Views = [];
  if (!workbook.Workbook.Views[0]) workbook.Workbook.Views[0] = {};
  workbook.Workbook.Views[0].RTL = true;

  utils.book_append_sheet(workbook, worksheet, fileName);

  return workbook;
};

const sortTableRecords = <R extends object>(
  tableRecords: R[],
  sortColumnKey: keyof R
): R[] => {
  return [...tableRecords].sort((prev, next) => {
    const k = sortColumnKey;

    return prev[k] === next[k] ? 0 : prev[k] > next[k] ? 1 : -1;
  });
};

export const handleExcelExport = <R extends object, C extends TableColumn>(
  tableRecords: R[],
  tableColumns: C[],
  createColumnsForExcel: CreateColumnsForExcel<C>,
  convertTableRecordValueToCellValue: ConvertTableRecordValueToCellValue<R>,
  columnKeyToMergeBy: keyof R,
  filename: string,
  coulmnWidth?: number,
  columnOrder?:ColumnOrderState
) => {
  const sortedRecords: R[] = sortTableRecords(tableRecords, columnKeyToMergeBy);

  const excelColumns: ExcelColumn[] = createColumnsForExcel(
    tableColumns,
    Object.keys(sortedRecords[0]),
    columnOrder
  );


  const excelRows: ExcelRow[] = convertTableRecordsToExcelRows(
    sortedRecords,
    excelColumns,
    convertTableRecordValueToCellValue
  );

  const worksheet: WorkSheet = utils.json_to_sheet(excelRows);

  worksheet["!merges"] = makeMerges(
    excelColumns,
    sortedRecords,
    columnKeyToMergeBy
  );


  excelColumns.forEach((column, index) => {
    //!cols is a special property used to define column styles.
    worksheet["!cols"] = worksheet["!cols"] || [];
    worksheet["!cols"][index] = { wch: coulmnWidth ?? DEFUALT_COLUMN_WIDTH };
  });

  const fileName = filename + "_" + formatDateAndTime(new Date());

  const workbook: WorkBook = makeWorkBook(worksheet, fileName);

  writeFile(workbook, `${fileName}.xlsx`);
};

const formatDateAndTime = (date: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/[\/: ]/g, "")
    .replace(",", "_");
};

export const formatTags = (tagsArray: string[], tagsMapping: IOption[]) => {
  if (!Array.isArray(tagsArray) || !Array.isArray(tagsArray)) return "";
  const labelList = tagsArray
    .map((tag) => {
      const foundLabel = tagsMapping.find((item) => item.value == tag);
      return foundLabel?.label ? foundLabel.label : null;
    })
    .filter((label) => label !== null);
  return labelList.join(" | ");
};
