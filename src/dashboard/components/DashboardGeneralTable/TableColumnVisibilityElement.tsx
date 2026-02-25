import { Button } from "@mui/material";
import {
  MRT_RowData,
  MRT_ShowHideColumnsButtonProps,
  MRT_ShowHideColumnsMenu,
} from "material-react-table";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";

type Props<TData extends MRT_RowData> = Pick<MRT_ShowHideColumnsButtonProps<TData>,'table'>;

export const TableColumnVisibilityElement = <TData extends MRT_RowData>({
  table,
  ...rest
}: Props<TData>) => {
  const [columnVisMenuAnchor, setColumnVisMenuAnchor] =
    useState<HTMLElement | null>(null);

  const handleColumnVisButton = (event: React.MouseEvent<HTMLElement>) => {
    setColumnVisMenuAnchor(event.currentTarget);
  };

  return (
    <>
  <Button className="table-button" onClick={handleColumnVisButton}>
    <div>
      <VisibilityOffIcon sx={{ width: "1.2rem" }} />
      <span> ניהול עמודות </span>
    </div>
  </Button>
  {
    columnVisMenuAnchor && (
      <MRT_ShowHideColumnsMenu
        table={table}
        anchorEl={columnVisMenuAnchor}
        setAnchorEl={setColumnVisMenuAnchor}
      />
    )
  }
  </>
)
};

export default TableColumnVisibilityElement