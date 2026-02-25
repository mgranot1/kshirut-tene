import ExcelJS, { FillPattern } from 'exceljs';
import { CardDetails } from '../../dashboard/components/KshirutFamilyCard/KshirutFamilyCard';
import { GroupedEquipments } from '../../dashboard/hooks/useGroupedEquipments';
import { OrgLevelCode } from '../../dashboard/types/dashboardOrgLevel.types';
import { OrgLevelOptions } from '../../dashboard/stores/nextOrgLevel.store';
import { getFormattedDateTime } from '../../shared/utils/dates.utils';
import { calcKshirutPercent } from '../../shared/utils/kshirut.utils';
import { getGraphColor } from '../../shared/utils/kshirutPercentColor';
import { KshirutType } from '../../dashboard/stores/kshirutType.store';
import { GeneralDashboardTableRow } from '../../dashboard/types/generalTable.types';
import { CONFIG } from '../../dashboard/pages/TopViewFamiliesPage/handleTopViewFamiliesToExcel';

type EquipmentStats = {
    amount: number;
    notKashirAmount: number;
};

export type GroupedEquipmentEntryToExcel = {
    code: string;
    description: string;
    equipments: Record<string, EquipmentStats>;
};
// Configuration constants


const setCellAttributes = (
    cell: ExcelJS.Cell,
    color: string = CONFIG.HEADER_COLOR,
    isBold: boolean = false
) => {
    fillCell(cell, color);
    createCellBorders(cell, CONFIG.BORDER_STYLE);
    cell.font = {
        bold: isBold,
        name: CONFIG.FONT_FAMILY
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
};

export const createCellBorders = (
    cell: ExcelJS.Cell,
    style: ExcelJS.BorderStyle = 'thin'
) => {
    cell.border = {
        top: { style: style },
        bottom: { style: style },
        left: { style: style },
        right: { style: style },
    };
}
export const fillCell = (
    cell: ExcelJS.Cell,
    color: string,
    type: FillPattern["type"] = 'pattern',
    pattern: ExcelJS.FillPatterns = 'solid'
) => {
    cell.fill = {
        type: type,
        pattern: pattern,
        fgColor: { argb: color },
    };
}

const createMainHeader = (
    worksheet: ExcelJS.Worksheet,
    colIndex: number,
    headerText: string
) => {
    // the border cells take the cells of a1,a2, 
    // therefore we will start from b and fill the cells along the first row.
    const startCol = colIndex * 2 + 2;
    worksheet.mergeCells(1, startCol, 1, startCol + 1);
    const headerCell = worksheet.getCell(1, startCol);
    headerCell.value = headerText;
    setCellAttributes(headerCell, CONFIG.HEADER_COLOR, true);
};

const createSubHeaders = (
    // filling the second row (2), and starting from b.
    worksheet: ExcelJS.Worksheet,
    colIndex: number
) => {
    const startCol = colIndex * 2 + 2;
    CONFIG.SUB_HEADERS.forEach((subHeader, subIndex) => {
        const cell = worksheet.getCell(2, startCol + subIndex);
        cell.value = subHeader;
        setCellAttributes(cell, CONFIG.SUB_HEADER_COLOR);
    });
};

const createRowHeader = (
    worksheet: ExcelJS.Worksheet,
    rowIndex: number,
    headerText: string
) => {
    // strating from the third row since the first 2 cells taken by the borderCells.
    const startRow = rowIndex * 2 + 3;
    worksheet.mergeCells(startRow, 1, startRow + 1, 1);
    const cell = worksheet.getCell(startRow, 1);
    cell.value = headerText;
    setCellAttributes(cell, CONFIG.ROW_HEADER_COLOR, true);
    worksheet.getColumn(1).width = CONFIG.ROW_HEADER_WIDTH;
};

const createTotalHeader = (
    worksheet: ExcelJS.Worksheet,
    rowCount: number
) => {
    const startRow = rowCount * 2 + 3;
    worksheet.mergeCells(startRow, 1, startRow + 1, 1);
    const cell = worksheet.getCell(startRow, 1);
    cell.value = 'סה"כ';
    setCellAttributes(cell, CONFIG.TOTAL_COLOR, true);
};




const createCornerCells = (worksheet: ExcelJS.Worksheet) => {
    ['A1', 'A2'].forEach(cellRef => {
        const cell = worksheet.getCell(cellRef);
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: CONFIG.CORNER_COLOR }
        };
    });
};


const createColumnHeaders = (
    columnHeaders: CardDetails[],
    worksheet: ExcelJS.Worksheet
) => {
    columnHeaders.forEach((header, index) => {
        createMainHeader(worksheet, index, header.description);
        createSubHeaders(worksheet, index);
    });

    worksheet.columns.forEach(column => {
        column.width = CONFIG.COLUMN_WIDTH;
    });

    const headerRow = worksheet.getRow(1);
    const subHeaderRow = worksheet.getRow(2);

    headerRow.eachCell(cell => setCellAttributes(cell, CONFIG.HEADER_COLOR, true));
    subHeaderRow.eachCell(cell => setCellAttributes(cell, CONFIG.SUB_HEADER_COLOR));
};


const createRowsHeaders = (
    rowDetails: CardDetails[],
    worksheet: ExcelJS.Worksheet
) => {
    rowDetails.forEach((row, index) => {
        createRowHeader(worksheet, index, row.description);
    });

    createTotalHeader(worksheet, rowDetails.length);
    createCornerCells(worksheet);
};

const createRows = (
    rowsData: GroupedEquipmentEntryToExcel[],
    worksheet: ExcelJS.Worksheet,
    columnHeaders: CardDetails[],
) => {
    rowsData.forEach((row, rowIndex) => {
        // strating from the third row since the first 2 cells taken by the borderCells.
        const startRow = rowIndex * 2 + 3;
        const endRow = startRow + 1;
        columnHeaders.forEach((column, columnIndex) => {
            const overallAmount = row.equipments[column.code]?.amount ?? 0
            const overallCol = columnIndex * 2 + 2;
            const overallCell = worksheet.getCell(startRow, overallCol);

            overallCell.value = row.equipments[column.code]?.amount ?? 0;

            const kashirCol = columnIndex * 2 + 3;
            const kashirCell = worksheet.getCell(startRow, kashirCol);

            const notKashirAmount = row.equipments[column.code]?.notKashirAmount ?? 0;
            kashirCell.value = (overallAmount) - notKashirAmount;

            worksheet.mergeCells(endRow, overallCol, endRow, kashirCol);

            const percentageCell = worksheet.getCell(endRow, overallCol);
            percentageCell.value = `${calcKshirutPercent(overallAmount, notKashirAmount)}%`;
            percentageCell
            setCellAttributes(percentageCell, getGraphColor(overallAmount, notKashirAmount).substring(1), false);
            setCellAttributes(kashirCell, overallAmount === 0 ? '000000' : 'DDEBF7', false);
            setCellAttributes(overallCell, overallAmount === 0 ? '000000' : 'DDEBF7', false);
        });
    });
};
const createOverallRow = (
    totalRowData: GroupedEquipmentEntryToExcel['equipments'],
    worksheet: ExcelJS.Worksheet,
    columnHeaders: CardDetails[],
    rowHeaders: CardDetails[],
) => {
    columnHeaders.forEach((column, columnIndex) => {
        const overallAmount = totalRowData[column.code]?.amount ?? 0
        const notKashirAmount = totalRowData[column.code]?.notKashirAmount ?? 0
        const overallCol = columnIndex * 2 + 2;
        const kashirCol = columnIndex * 2 + 3;
        const totalRows = rowHeaders.length;
        const startRow = totalRows * 2 + 3; // Start row for overall row (after all data rows)
        const endRow = startRow + 1; // Row for percentage

        const overallCell = worksheet.getCell(startRow, overallCol);
        overallCell.value = overallAmount;
        setCellAttributes(overallCell, overallAmount === 0 ? '000000' : 'DDEBF7', false);

        const kashirCell = worksheet.getCell(startRow, kashirCol);
        kashirCell.value = overallAmount - notKashirAmount;
        setCellAttributes(kashirCell, overallAmount === 0 ? '000000' : 'DDEBF7', false);

        worksheet.mergeCells(endRow, overallCol, endRow, kashirCol);

        const percentageCell = worksheet.getCell(endRow, overallCol);
        percentageCell.value = `${calcKshirutPercent(overallAmount, notKashirAmount)}%`;
        setCellAttributes(percentageCell, getGraphColor(overallAmount, notKashirAmount).substring(1), false);


    })
};


const triggerDownload = async (workbook: ExcelJS.Workbook) => {
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = CONFIG.SHEET_NAME + ".xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
};

export const exportTopViewFamiliesToExcel = async (
    columnHeaders: CardDetails[],
    rowHeaders: CardDetails[],
    rowsData: GroupedEquipmentEntryToExcel[],
    totalRowData: GroupedEquipmentEntryToExcel['equipments'],
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(CONFIG.SHEET_NAME);
    try {
        createColumnHeaders(columnHeaders, worksheet);
        createRowsHeaders(rowHeaders, worksheet);
        createRows(rowsData, worksheet, columnHeaders);
        createOverallRow(totalRowData, worksheet, columnHeaders, rowHeaders);
        await triggerDownload(workbook);
    } catch (error) {
        console.error('Export error:', error);
    }
};
export default exportTopViewFamiliesToExcel;