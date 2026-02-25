import AddIcon from "@mui/icons-material/AddRounded";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { Box, Button, ListItemIcon, MenuItem, Typography } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_ColumnOrderState,
  MRT_RowSelectionState,
  MRT_RowVirtualizer,
  MRT_VisibilityState,
} from "material-react-table";
import { MRT_Localization_HE } from "material-react-table/locales/he";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import DashboardFilters from "../DashboardFilters/DashboardFilters";
import FilterList from "../DashboardFilters/FilterList";
import UpdateEquipmentDialog from "../UpdateEquipmentDialog/UpdateEquipmentDialog";

import { useIsFetching } from "@tanstack/react-query";
import React from "react";
import ZadikDataService from "../../../report/services/zadikData/Zadikdata.service";
import { REPORT_PREFIX } from "../../../router/router.constant";
import { SitePaths } from "../../../router/routes";
import Loader from "../../../shared/components/Loader/Loader";
import SearchField from "../../../shared/components/SearchField/SearchField";
import useSessionStorage from "../../../shared/hooks/useSessionStorage";
import { paramsAtom } from "../../../shared/stores/params.store";
import {
  ExpandedExpectedTime,
  FaultStatus,
} from "../../../shared/types/params.types";
import { IZadikData } from "../../../shared/types/ZadikData.types";
import { ZADIK_DATA_SESSION_KEY } from "../../../shared/utils/constants";
import useDashboardExportToExcel from "../../hooks/useDashboardExportToExcel";
import useDbdGeneralFilters from "../../hooks/useDbdFilters";
import useTableVariants from "../../hooks/useTableVariants";
import { dashboardFilteredGeneralData } from "../../stores/DashboardData.store";
import { kshirutTypeState } from "../../stores/kshirutType.store";
import { DashboardFault } from "../../types/FaultTable.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import { TableVariantBase } from "../../types/variant.types";
import {
  expectedTimeIsLessThan,
  extractExpectedTimeToExpand,
} from "../../utils/kshirutDevelopment.utils";
import { convertMRTColumnDataToVariantColumnOrder } from "../../utils/tableVariant.utils";
import VariantSelectInterface from "../../VariantSelectInterface/VariantSelectInterface";
import TableVariantCreateDialog from "../VariantCreateDialog/VariantCreateDialog";
import createDashboardColumns from "./createDashboardColumns";
import "./DbdFaultTable.scss";
import "./standardTable.scss";
import createStandardTable, {
  handleStandardTableSearch,
} from "./standardTable.utils";
import TableColumnVisibilityElement from "./TableColumnVisibilityElement";

interface IDbdGeneralTableProps {
  hideColumns: string[];
  isEquipmentTable?: boolean;
  tableId?: string;
}

const DashboardGeneralTable: React.FC<IDbdGeneralTableProps> = ({
  hideColumns,
  isEquipmentTable = true,
  tableId = "dashboardGeneralTable",
}) => {
  const excelColumnWidth = 10;
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
  const params = useRecoilValue(paramsAtom);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const kshirutType = useRecoilValue(kshirutTypeState);
  const [_, setSelectedZadik] = useSessionStorage<IZadikData>(
    ZADIK_DATA_SESSION_KEY
  );
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [openUpdateEquipments, setOpenUpdateEquipments] =
    useState<boolean>(false);
  const [openVariantCreate, setOpenVariantCreate] = useState<boolean>(false);
  const { fields, selectedFilters, setSelectedFilters } =
    useDbdGeneralFilters();
  const generalData = useRecoilValue<GeneralDashboardTableRow[]>(
    dashboardFilteredGeneralData
  );

  const [searchValue, setSearchValue] = useState("");
  const [isTableEdited, setIsTableEdited] = useState<boolean>(false);

  const columns = useMemo<MRT_ColumnDef<GeneralDashboardTableRow>[]>(() => {
    return createDashboardColumns({
      options: {
        ...params,
        physicalLocation: params.physicalLocation,
      },
      kshirutType: kshirutType.value,
    });
  }, []);

  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    hideColumns.reduce((acc, curr) => {
      acc[curr] = false;
      return acc;
    }, {})
  );

  /*
  ~ function updateTableStatesByVariant
     updates the table's columnOrder and columnVisibility according to a given tableVariant
  */
  function updateTableStatesByVariant({
    variant,
  }: {
    variant: TableVariantBase<GeneralDashboardTableRow>;
  }): void {
    const columnOrderFromVariant = variant.values.columnOrder;

    if (!columnOrderFromVariant) {
      return;
    }

    const visibleColumns = Object.fromEntries(
      columnOrderFromVariant.map((column) => [column, true])
    );
    const invisibleColumnFromVariant: string[] = // Invisible columns are all the columns that are not specified in the variant's columnOrder
      columns.reduce((acc: string[], column) => {
        if (column.id && visibleColumns[column.id] !== true) {
          return [...acc, column.id];
        }
        return acc;
      }, []);
    setColumnOrder([...columnOrderFromVariant, ...invisibleColumnFromVariant]);
    setColumnVisibility(
      Object.fromEntries(
        invisibleColumnFromVariant.map((columnId) => [columnId, false])
      )
    );
    setIsTableEdited(false);
  }

  function resetTable() {
    setColumnVisibility(
      Object.fromEntries(hideColumns.map((column) => [column, false]))
    );
    setColumnOrder(defaultVariant.values.columnOrder);
    setIsTableEdited(false);
  }

  const {
    addVariant,
    variantList,
    activeVariantId,
    applyVariant,
    deleteVariant,
    editVariant,
    initialVariant: defaultVariant,
  } = useTableVariants(tableId, columns, {
    onVariantChange: updateTableStatesByVariant,
    onVariantClear: resetTable,
    onVariantAdd: ({ newVariant }) => {
      applyVariant(newVariant.variantId);
    },
    onVariantEdit: ({ changedVariant }) => {
      updateTableStatesByVariant({ variant: changedVariant });
    },
    onLoad: () => {
      if (variantList.length > 0) {
        applyVariant(variantList[0].variantId);
      }
    },
  });

  const sortedEquipmentsByExpectedTime: GeneralDashboardTableRow[] =
    Object.values(
      generalData
        .slice()
        .map((d) =>
          d.faultStatus === FaultStatus.Done
            ? { ...d, expectedTime: ExpandedExpectedTime.None }
            : !d.expectedTime
              ? { ...d, expectedTime: ExpandedExpectedTime.Unknown }
              : d
        )
        .sort((a, b) =>
          expectedTimeIsLessThan(
            extractExpectedTimeToExpand(a),
            extractExpectedTimeToExpand(b)
          )
            ? 1
            : -1
        )
        .reduce((acc, item) => {
          if (!acc[item.equipment]) {
            acc[item.equipment] = item;
          }
          return acc;
        }, {})
    );

  const { handleDashBoardTableExcelExport } = useDashboardExportToExcel();
  const getVisibleColumns = () => {
    const visibleColumns = columns.filter((column) => {
      const key = column.accessorKey || (column.id as string);
      return columnVisibility[key] !== false;
    });
    return visibleColumns;
  };
  const equipmentData = sortedEquipmentsByExpectedTime.map(
    (equipment: GeneralDashboardTableRow) => {
      const { faultNum, expectedTime, ...equipFields } = equipment;

      if (equipment.faultStatus === FaultStatus.Done) {
        return equipFields as GeneralDashboardTableRow;
      } else {
        return equipment;
      }
    }
  );

  const [columnOrder, setColumnOrder] = useState<MRT_ColumnOrderState>([
    "mrt-row-actions",
    "mrt-row-select",
    ...defaultVariant.values.columnOrder,
  ]);

  const data = useMemo<GeneralDashboardTableRow[]>(() => {
    //fault list
    if (!isEquipmentTable) {
      return generalData.filter((record) => record.faultNum);
    }
    //equipment list, and show fault properties
    if (hideColumns.some((key) => columnVisibility[key] === true)) {
      return generalData;
    }
    //equipment list, and hide all fault properties
    return equipmentData;
  }, [generalData, columnVisibility]);

  const handleFiltersButton = () => {
    setIsFiltersOpen(true);
  };

  const getRowIdFromZadik = (equipment: string): string => {
    return equipment;
  };

  //todo: replace with useGetZadikData

  const handleRowAction = async (
    currentEquipment: GeneralDashboardTableRow,
    link: string
  ) => {
    const zadikData: IZadikData = await ZadikDataService.getZadikData(
      currentEquipment.equipment
    );

    setSelectedZadik(zadikData);

    window.open(link, "_blank");
  };
  const selectedEquipments: GeneralDashboardTableRow[] = Object.values(
    generalData
      .filter(
        (equipment) => rowSelection[getRowIdFromZadik(equipment.equipment)]
      )
      .reduce((acc, item) => {
        if (!acc[item.equipment]) {
          acc[item.equipment] = item;
        }
        return acc;
      }, {})
  );
  const table = createStandardTable({
    columns,
    data,
    localization: MRT_Localization_HE,
    enableColumnOrdering: true,
    getRowId: (row) => getRowIdFromZadik(row.equipment),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection, columnVisibility, columnOrder },
    rowVirtualizerInstanceRef,
    onColumnOrderChange: (newOrder) => {
      setColumnOrder(newOrder);
      setIsTableEdited(true);
    },
    enableRowNumbers: false,
    onColumnVisibilityChange: (state) => {
      setColumnVisibility(state);
      setIsTableEdited(true);
    },
    memoMode: "cells",
    rowVirtualizerOptions: {
      overscan: 25,
      estimateSize: () => 52,
    },
    muiTableContainerProps: {
      sx: {
        // This is the current solution for processing the table height so it will not
        // Be burried under the window. Should be removed when migrated from material-react-table
        // to tanstack.
        maxHeight: `calc(93vh ${
          selectedFilters.length > 0 ? "- 0.15em - 6vh" : ""
        } - 180px)`,
        // maxHeight: "60vh",
        maxWidth: "100vw",
        transform: "translate3d(0,0,0)",
        scrollbarWidth: "3rem",
      },
    },
    enableRowActions: true,
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={1}
        onClick={() => {
          closeMenu();
          handleRowAction(
            row.original,
            `#/${REPORT_PREFIX}/${SitePaths.KSHIRUT_REPORT}/${row.id}`
          );
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <CropSquareIcon />
        </ListItemIcon>
        דיווח כשירות
      </MenuItem>,
    ],
  });

  useEffect(() => {
    setRowSelection({});
  }, [selectedFilters]);

  const onSearchType = (str: string) => {
    const regex = new RegExp("^[0-9]*$");
    if (regex.test(str) || str === "") {
      setSearchValue(str);
    }
  };
  const isFetching = useIsFetching({
    queryKey: ["dashboardData"],
  });

  return (
    <>
      {isFetching ? <Loader></Loader> : ""}
      <section className="dbd-table">
        {isFiltersOpen && (
          <DashboardFilters<GeneralDashboardTableRow>
            title="סננים"
            isOpen={isFiltersOpen}
            setIsOpen={setIsFiltersOpen}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            fields={fields}
          />
        )}

        <Box className="dbd-table-toolbox">
          <div className="dbd-table-toolbox__buttons">
            <Button className="table-button" onClick={handleFiltersButton}>
              <div>
                <AddIcon sx={{ width: "1.2rem" }} />
                <span> הוספת סינון </span>
              </div>
            </Button>

            <TableColumnVisibilityElement table={table} />

            <Button
              className="table-button"
              variant="outlined"
              disabled={!isTableEdited}
              onClick={() => {
                if (activeVariantId !== null) {
                  editVariant(
                    activeVariantId,
                    {},
                    {
                      columnOrder: convertMRTColumnDataToVariantColumnOrder(
                        columnOrder,
                        columnVisibility
                      ),
                    }
                  );
                } else {
                  setOpenVariantCreate(true);
                }
              }}
            >
              שמור ווריאנט
            </Button>

            <VariantSelectInterface
              activeVariantIndex={
                variantList.findIndex(
                  (variant) => variant.variantId == activeVariantId
                ) !== -1
                  ? variantList.findIndex(
                      (variant) => variant.variantId == activeVariantId
                    )
                  : null
              }
              variantList={variantList}
              onChooseVariant={(id) => applyVariant(id)}
              onClear={() => applyVariant(null)}
              onDeleteVariant={(id) => deleteVariant(id)}
              onRename={({ name, variantId }) =>
                editVariant(variantId, { variantDescription: name })
              }
            />

            <div className="last-item">
              <SearchField
                searchValue={searchValue}
                onClear={() => setSearchValue("")}
                placeholder={`חיפוש צ'`}
                onType={onSearchType}
                onSearch={() => {
                  handleStandardTableSearch<DashboardFault>(
                    data,
                    "equipment",
                    searchValue,
                    rowVirtualizerInstanceRef
                  );
                  if (!rowSelection[getRowIdFromZadik(searchValue)]) {
                    table
                      .getRow(getRowIdFromZadik(searchValue))
                      .toggleSelected();
                  }
                }}
                inputProps={{ maxLength: 6, pattern: "^[0-9]*$" }}
              />
              {selectedEquipments?.length > 0 && (
                <Button
                  className={`table-button update ${
                    selectedEquipments.length === 0 ? "closed" : ""
                  }`}
                  variant="outlined"
                  onClick={() =>
                    selectedEquipments.length > 0 &&
                    setOpenUpdateEquipments(true)
                  }
                >
                  {`עדכון נתוני צ' (${selectedEquipments.length} נבחרו) `}
                </Button>
              )}
              {/* <Button className="table-button save-report-button">שמירת דו"ח</Button> */}
              <Button
                className="table-button save-report-button"
                onClick={() =>
                  handleDashBoardTableExcelExport(
                    data,
                    getVisibleColumns(),
                    columnOrder,
                    excelColumnWidth
                  )
                }
              >
                ייצוא לאקסל
              </Button>
            </div>
          </div>

          {selectedFilters.length > 0 && (
            <div className="dbd-table-toolbox__filters-tags">
              <FilterList
                isEditMode={true}
                filters={selectedFilters}
                onChangeFilters={setSelectedFilters}
              />
            </div>
          )}

          <div>
            <Typography sx={{ color: "rgba(35,36,37,0.39)" }}>
              {" "}
              <span> {data.length} רשומות </span>{" "}
            </Typography>
          </div>
        </Box>

        <MaterialReactTable table={table} />
      </section>
      <div id="updateEquipments-container" />
      {openUpdateEquipments && (
        <UpdateEquipmentDialog
          open={openUpdateEquipments}
          setOpen={setOpenUpdateEquipments}
          equipments={selectedEquipments}
          dialogProps={{
            container: () =>
              document.getElementById("updateEquipments-container"),
          }}
          onDialogComplete={() => setRowSelection({})}
        />
      )}
      <div id="createVariant-container" />
      {openVariantCreate && (
        <TableVariantCreateDialog
          open={openVariantCreate}
          onSave={(name) => {
            addVariant(
              name,
              {},
              {
                columnOrder: convertMRTColumnDataToVariantColumnOrder(
                  columnOrder,
                  columnVisibility
                ),
              }
            );
            setOpenVariantCreate(false);
          }}
          dialogProps={{
            container: () => document.getElementById("createVariant-container"),
          }}
          onCancel={() => setOpenVariantCreate(false)}
        />
      )}
    </>
  );
};
export default DashboardGeneralTable;
