import { MRT_ColumnDef, MRT_ColumnOrderState } from "material-react-table";
import { useRecoilValue } from "recoil";
import { paramsAtom } from "../../shared/stores/params.store";
import { IOption } from "../../shared/types/general.types";
import { Qualification } from "../../shared/types/kshirutData.types";
import { MaterialTypes } from "../../shared/types/mean.types";
import { convertDateToTimeDisplay } from "../../shared/utils/dates.utils";
import { DashboardFaultMaterial } from "../types/FaultTable.types";
import {
  dashboardEquipmentRowKeys,
  GeneralDashboardTableRow,
} from "../types/generalTable.types";
import {
  ExcelColumn,
  formatTags,
  handleExcelExport,
} from "../utils/excel.utils";

const useDashboardExportToExcel = () => {
  const params = useRecoilValue(paramsAtom);

  const convertTableRecordValueToCellValue = (
    record: GeneralDashboardTableRow,
    excelColumnKey: ExcelColumn["key"]
  ): string => {
    switch (excelColumnKey) {
      case "kshirut":
      case "warKshirut": {
        return Qualification[record[excelColumnKey]]?.text;
      }

      case "isGdudManeuvering": {
        return record.isGdudManeuvering ? "בלחימה" : "לא בלחימה";
      }

      case "isAgamForce":
      case "isLogisticForce": {
        return record[excelColumnKey] ? "כן" : "";
      }

      case "lastUpdateDate": {
        return record.lastUpdateTimestamp
          ? record.lastUpdateTimestamp.toLocaleDateString("en-gb")
          : "";
      }

      case "lastUpdateTime": {
        return record.lastUpdateTimestamp
          ? convertDateToTimeDisplay(record.lastUpdateTimestamp)
          : "";
      }
      case "tags": {
        return formatTags(record[excelColumnKey], params.tags);
      }

      case "faultHh":
      case "faultEmz": {
        return record[excelColumnKey]
          ?.filter((i) => i.missingParts === MaterialTypes.Missing)
          .length.toString();
      }

      case "faultHhProblem":
      case "faultEmzProblem": {
        return record[excelColumnKey.replace("Problem", "")]
          ?.filter(
            (m: DashboardFaultMaterial) =>
              m.missingParts === MaterialTypes.Missing &&
              (m.material === "" || !m.isValid)
          )
          .length.toString();
      }

      case "createTimestamp":
      case "changeTimestamp": {
        const timestampValue = record[excelColumnKey];
        return timestampValue ? timestampValue.toLocaleString("en-gb") : "";
      }
    }

    if (excelColumnKey && params[excelColumnKey]) {
      return params[excelColumnKey].find(
        (option: IOption) =>
          option.value ===
          record[excelColumnKey as keyof GeneralDashboardTableRow]
      )?.label;
    }

    return (
      record[excelColumnKey as keyof GeneralDashboardTableRow] ?? ""
    ).toString();
  };

  const createColumnsForExcel = (
    tableColumns: MRT_ColumnDef<GeneralDashboardTableRow, unknown>[],
    recordsKeys: string[],
    columnOrder?: MRT_ColumnOrderState
  ): ExcelColumn[] => {
    const visibleColumnIds = new Set(tableColumns.map(col => col.id));

    const filteredColumnOrder = columnOrder?.filter(id => visibleColumnIds.has(id)) ?? [];

    const columnMap = new Map(tableColumns.map(col => [col.id, col]));

    const orderedColumns = filteredColumnOrder
      .map(id => columnMap.get(id))
      .filter(col => col !== undefined) as MRT_ColumnDef<GeneralDashboardTableRow, unknown>[];

    const excelColumns: ExcelColumn[] = orderedColumns
      .filter(
        (column) =>
          column.id !== "lastUpdateTimestamp" && column.id !== "forces"
      )
      .map((column) => {
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

    const hasForces = orderedColumns.some(col => col.id === "forces");
    const hasLastUpdateTimestamp = orderedColumns.some(
      col => col.id === "lastUpdateTimestamp"
    );

    const columnsToInsert: ExcelColumn[] = [];

    if (hasForces) {
      columnsToInsert.push(
        {
          key: "isAgamForce",
          title: 'מכפיל כח אג"מי',
          mergeIt: true,
        },
        {
          key: "isLogisticForce",
          title: "מכפיל כח לוגיסטי",
          mergeIt: true,
        }
      );
    }

    if (hasLastUpdateTimestamp) {
      columnsToInsert.push(
        {
          key: "lastUpdateDate",
          title: "תאריך עדכון אחרון",
          mergeIt: false,
        },
        {
          key: "lastUpdateTime",
          title: "שעת עדכון אחרונה",
          mergeIt: false,
        }
      );
    }

    excelColumns.splice(10, 0, ...columnsToInsert);

    return excelColumns;
  };

  const handleDashBoardTableExcelExport = (
    dataToExport: GeneralDashboardTableRow[],
    columns: MRT_ColumnDef<GeneralDashboardTableRow, unknown>[],
    columnOrder: MRT_ColumnOrderState,
    columnWidth?: number
  ) =>
    handleExcelExport(
      dataToExport,
      columns,
      createColumnsForExcel,
      convertTableRecordValueToCellValue,
      "equipment",
      "EQUIPMENT_LIST",
      columnWidth,
      columnOrder
    );

  return { handleDashBoardTableExcelExport };
};

export default useDashboardExportToExcel;
