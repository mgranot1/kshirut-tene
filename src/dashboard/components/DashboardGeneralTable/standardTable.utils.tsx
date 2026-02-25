import CheckBoxBlankIcon from "@mui/icons-material/CheckBoxOutlineBlankTwoTone";
import CheckBoxIcon from "@mui/icons-material/CheckBoxTwoTone";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBoxTwoTone";
import { defaultRangeExtractor } from "@tanstack/react-virtual";
import {
  MRT_RowData,
  MRT_RowVirtualizer,
  MRT_TableInstance,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import React from "react";
import tableStyles from "./EquipmentTable.styles";

const createStandardTable = <TData extends MRT_RowData>(
  tableOptions: MRT_TableOptions<TData>
): MRT_TableInstance<TData> => {
  const table: MRT_TableInstance<TData> = useMaterialReactTable({
    enableFullScreenToggle: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    enableBottomToolbar: false,
    enableRowNumbers: true,
    muiTableContainerProps: {
      sx: {
        maxHeight: "60vh",
        maxWidth: "100vw",
        transform: "translate3d(0,0,0)",
        scrollbarWidth: "3rem",
      },
    },
    enableFilters: false,
    enableRowSelection: true,
    enableDensityToggle: false,
    initialState: {
      showGlobalFilter: true,
      density: "compact",
      columnPinning: {
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    enableColumnActions: false,
    muiTableHeadCellProps: {
      sx: tableStyles.KingdomTable.headCell,
    },
    muiTableBodyCellProps: {
      sx: tableStyles.KingdomTable.bodyCell,
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "פעולות",
        muiTableHeadCellProps: {
          sx: tableStyles.KingdomTable.displayColumn.rowActions.headCell,
        },
        muiTableBodyCellProps: {
          sx: tableStyles.KingdomTable.displayColumn.rowActions.headCell,
        },
      },
      "mrt-row-select": {
        muiTableHeadCellProps: {
          sx: tableStyles.KingdomTable.displayColumn.rowSelect.headCell,
        },
        muiTableBodyCellProps: {
          sx: tableStyles.KingdomTable.displayColumn.rowSelect.bodyCell,
        },
      },
    },
    rowVirtualizerOptions: {
      rangeExtractor: React.useCallback(defaultRangeExtractor, []),
    },
    muiSelectCheckboxProps: {
      icon: <CheckBoxBlankIcon />,
      checkedIcon: <CheckBoxIcon />,
      indeterminateIcon: <IndeterminateCheckBoxIcon />,
    },
    muiSelectAllCheckboxProps: {
      icon: <CheckBoxBlankIcon />,
      checkedIcon: <CheckBoxIcon />,
      indeterminateIcon: <IndeterminateCheckBoxIcon />,
    },
    ...tableOptions,
  });
  return table;
};

export function handleStandardTableSearch<T extends MRT_RowData>(
  data: T[],
  searchField: keyof T,
  searchedValue: string,
  tableVirtualizer: React.RefObject<
    MRT_RowVirtualizer<HTMLDivElement, HTMLTableRowElement>
  >
) {
  const searchedIndex = data.findIndex(
    (element) => element[searchField] === searchedValue
  );

  if (tableVirtualizer.current && searchedIndex >= 0) {
    tableVirtualizer.current.scrollToIndex(searchedIndex, {
      align: "start",
      behavior: "auto",
    });
  }
}

export default createStandardTable;
