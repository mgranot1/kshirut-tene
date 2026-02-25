import { getFormattedDateTime } from "../../../shared/utils/dates.utils";
import ExcelJS, { FillPattern } from 'exceljs';
import { CardDetails } from "../../components/KshirutFamilyCard/KshirutFamilyCard";
import { KshirutType } from "../../stores/kshirutType.store";
import { OrgLevelOptions } from "../../stores/nextOrgLevel.store";
import { GroupedEquipmentEntryToExcel } from "../../../shared/utils/exceljs.utils";
import { GroupedEquipments } from "../../hooks/useGroupedEquipments";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";

export const CONFIG = {
    SHEET_NAME: 'כשירות משפחות ' + getFormattedDateTime(),
    SUB_HEADERS: ['מצאי', 'כשיר'],
    FONT_FAMILY: 'Tahoma',
    HEADER_COLOR: 'b5b4b4',
    SUB_HEADER_COLOR: 'B4C6E7',
    ROW_HEADER_COLOR: 'ececf4',
    TOTAL_COLOR: 'B4C6E7',
    CORNER_COLOR: 'b5b4b4',
    COLUMN_WIDTH: 15,
    ROW_HEADER_WIDTH: 20,
    BORDER_STYLE: 'thin' as ExcelJS.BorderStyle
};
export const getGroupedEquipmentsForExcel = (
    rows: CardDetails[],
    groupedEquipments: Record<string, { equipments: any[]; notKashirAmount: number }>,
    isRoutineTree: boolean,
    kshirutType: KshirutType,
    nextOrgLevel: OrgLevelOptions,
    columns: CardDetails[],
    groupedEquipmentsByFamilies: (equipments: GeneralDashboardTableRow[], kshirutType: KshirutType) => GroupedEquipments
): GroupedEquipmentEntryToExcel[] => {
    return rows
        .filter((row) => groupedEquipments?.[row.code]?.equipments?.length > 0)
        .map(row => {
            const equipments = groupedEquipments?.[row.code]?.equipments ?? [];
            const transformedEquipments =
                groupedEquipmentsByFamilies(
                    equipments,
                    kshirutType
                )
            const flattenedEquipments = Object.entries(transformedEquipments).reduce(
                (acc, [key, value]) => {
                    acc[key] = {
                        amount: value.equipments.length,
                        notKashirAmount: value.notKashirAmount
                    };
                    return acc;
                },
                {} as GroupedEquipmentEntryToExcel['equipments']
            );

            return {
                ...row,
                equipments: flattenedEquipments
            };
        });
};

export const getTotalRowForExcel = (
    columns: CardDetails[],
    equipmentsData: any[],
    isRoutineTree: boolean,
    kshirutType: KshirutType,
    nextOrgLevel: OrgLevelOptions,
    groupedEquipmentsByFamilies: (equipments: GeneralDashboardTableRow[], kshirutType: KshirutType) => GroupedEquipments
): GroupedEquipmentEntryToExcel['equipments'] => {

    return columns.reduce(
        (acc, column) => {
            const code = column.code;
            const groupedData = groupedEquipmentsByFamilies(
                equipmentsData,
                kshirutType
            )
            if (groupedData[code]) {
                const { equipments, notKashirAmount } = groupedData[code];
                acc[code] = { amount: equipments.length, notKashirAmount };
            }
            return acc;
        },
        {} as GroupedEquipmentEntryToExcel['equipments']
    );
};
