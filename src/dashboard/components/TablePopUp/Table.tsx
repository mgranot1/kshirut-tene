import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_RowVirtualizer,
  MRT_VisibilityState,
} from "material-react-table";
import { MRT_Localization_HE } from "material-react-table/locales/he";
import { useRef, useState } from "react";
import createStandardTable from "../DashboardGeneralTable/standardTable.utils";

export interface IGenericTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  hideColumns: T[];
  getRowId: (row: T) => string;
}

const GenericTable = <T extends MRT_RowData>({
  columns,
  data,
  hideColumns,
  getRowId,
}: IGenericTableProps<T>) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    hideColumns.reduce((acc, curr) => {
      acc[String(curr)] = false;
      return acc;
    }, {})
  );

  const table = createStandardTable({
    columns,
    data,
    localization: MRT_Localization_HE,
    enableColumnOrdering: true,
    enableColumnPinning: false,
    getRowId: getRowId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection, columnVisibility },
    rowVirtualizerInstanceRef,
    enableRowNumbers: false,
    layoutMode: "grid",
    onColumnVisibilityChange: (state) => {
      setColumnVisibility(state);
    },
    memoMode: "cells",
    rowVirtualizerOptions: { overscan: 25, estimateSize: () => 52 },
    muiTableContainerProps: {
      sx: {
        maxHeight: "50vh",
        maxWidth: "100vw",
        transform: "translate3d(0,0,0)",
        scrollbarWidth: "3rem",
      },
    },
    // enableRowActions: true,
    // renderRowActionMenuItems: ({ closeMenu, row }) => [ ],
  });

  return <MaterialReactTable table={table} />;
};

export default GenericTable;
