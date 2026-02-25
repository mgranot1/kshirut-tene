import uniqBy from "lodash/uniqBy";
import { ReactNode, useMemo } from "react";
import { convertTableRecordValueToCellValueT } from "../../hooks/useTableExportToExcel";
import { useMissingHHData } from "../../services/dashboard/useMissingHHData";
import GenericTablePopUp from "../TablePopUp/TablePopUp";
import { TitleValueCard } from "../TopViewComponents/TopViewComponents";
import { createHHTableColumns, HHTableRow } from "./createHHTableColumns";

interface IHHTablePopUpProps {
  open: boolean;
  closePopUp: () => void;
}

const HHTablePopUp = (props: IHHTablePopUpProps) => {
  const getTableRowId = (row: HHTableRow) => row.equipment;
  const { isPending, data } = useMissingHHData(props.open);

  const titleComponent: ReactNode = useMemo(() => {
    const equiCount = uniqBy(data, "equipment").length;
    const hhCount = data?.length;
    const invalidHHsCount = data?.filter(
      (hh) => !hh.isValid || !hh.material
    ).length;
    return (
      <TitleValueCard
        title="פערי חלפים"
        className="fault-measure item2"
        value={equiCount.toString()}
        footer={
          <div>
            {hhCount} מק"טים |{" "}
            <span style={{ color: "red" }}>
              {" "}
              <b> {invalidHHsCount} חריגים </b>
            </span>
          </div>
        }
      />
    );
  }, [data]);

  const convertTableRecordValueToCellValue: convertTableRecordValueToCellValueT =
    (record, excelColumnKey): string => {
      switch (excelColumnKey) {
        case "faultNum":
          return `${record.faultNum}`;
        case "essence":
          return `${record.essence}`;
        case "materialNumber":
          return `${record.material}`;
        case "materialDesc":
          return `${!record.materialDesc ? "מק''ט לא קיים" : record.materialDesc}`;
      }
      return record[excelColumnKey];
    };

  return (
    <GenericTablePopUp
      open={props.open}
      titleComponent={titleComponent}
      tableFields={{
        columns: createHHTableColumns(),
        hideColumns: [],
        data: data!,
        getRowId: getTableRowId,
      }}
      isLoading={!data && isPending}
      onClosePopUp={props.closePopUp}
      isExcelAvailable={true}
      excelName="mising hh"
      columnKeyToMergeBy="equipment"
      convertTableRecordValueToCellValue={convertTableRecordValueToCellValue}
    />
  );
};

export default HHTablePopUp;
