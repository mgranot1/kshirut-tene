import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { MRT_RowData } from "material-react-table";
import Loader from "../../../shared/components/Loader/Loader";
import useTableExportToExcel, {
  convertTableRecordValueToCellValueT,
} from "../../hooks/useTableExportToExcel";
import GenericTable, { IGenericTableProps } from "./Table";
import "./TablePopUp.scss";

export interface ITablePopUpProps<T extends MRT_RowData> {
  tableFields: IGenericTableProps<T>;
  titleComponent: React.ReactNode;
  open: boolean;
  isLoading: boolean;
  onClosePopUp: () => void;
  isExcelAvailable?: boolean;
  excelName?: string;
  columnKeyToMergeBy?: string;
  convertTableRecordValueToCellValue?: convertTableRecordValueToCellValueT;
}

const GenericTablePopUp = <T extends MRT_RowData>({
  tableFields,
  titleComponent,
  onClosePopUp,
  open,
  isLoading,
  excelName,
  isExcelAvailable = false,
  columnKeyToMergeBy,
  convertTableRecordValueToCellValue,
}: ITablePopUpProps<T>) => {
  const { handleTableExcelExport } = useTableExportToExcel(
    convertTableRecordValueToCellValue
  );

  return (
    <Dialog
      open={open}
      fullWidth={true}
      onClose={onClosePopUp}
      maxWidth="lg"
      PaperProps={{ sx: { maxHeight: '80%' } }}
    >
      <DialogContent sx={{ backgroundColor: "var(--primary-bg-color)", justifyContent: 'space-between' }}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <DialogTitle>
              <IconButton
                aria-label="close"
                onClick={onClosePopUp}
                sx={{ position: "absolute", right: 5, top: 5 }}
              >
                <CloseIcon />
              </IconButton>

              <div className="dialog-title-container">
                <div className="dialog-title-card-container">
                  {titleComponent}
                </div>
                {isExcelAvailable && (
                  <div className="dialog-excel-button">

                    <Button
                      className="table-button save-report-button"
                      onClick={() =>
                        tableFields.data &&
                        handleTableExcelExport(
                          excelName ?? new Date().toDateString(),
                          tableFields.data,
                          // @ts-ignore
                          tableFields.columns,
                          columnKeyToMergeBy
                        )
                      }
                    >
                      ייצוא לאקסל
                    </Button>

                  </div>
                )}
              </div>
            </DialogTitle>
            <GenericTable {...tableFields} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenericTablePopUp;
