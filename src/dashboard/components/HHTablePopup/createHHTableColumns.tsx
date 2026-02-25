import { MRT_ColumnDef } from "material-react-table";
import {
  DashboardFault,
  DashboardFaultMaterial,
} from "../../types/FaultTable.types";
import TextTooltip from "../TextTooltip/TextTooltip";

export type HHTableRow = Pick<
  DashboardFault,
  "faultNum" | "essence" | "equipment"
> &
  Pick<
    DashboardFaultMaterial,
    "material" | "materialDesc" | "quantity" | "isValid"
  > & { materialUserDesc: string };

export const createHHTableColumns = (): MRT_ColumnDef<HHTableRow>[] => [
  {
    accessorKey: "equipment",
    id: "equipment",
    enableClickToCopy: true,
    header: "מספר צ'",
    size: 120,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    id: "faultNum",
    enableClickToCopy: true,
    header: "תקלה",
    size: 150,
    accessorFn(originalRow) {
      return `${originalRow.faultNum}`;
    },
  },
  {
    id: "essence",
    enableClickToCopy: true,
    header: "תיאור התקלה",
    size: 150,
    accessorFn(originalRow) {
      return `${originalRow.essence}`;
    },
  },
  {
    id: "materialNumber",
    enableClickToCopy: true,
    header: "מק''ט",
    size: 150,
    accessorFn(originalRow) {
      return `${originalRow.material}`;
    },
  },
  {
    id: "materialDesc",
    enableClickToCopy: true,
    header: "תיאור המק\"ט",
    size: 150,
    accessorFn(originalRow) {
      return `${!!originalRow.materialDesc ? originalRow.materialDesc : "מק''ט לא קיים"}`;
    },
    Cell: ({ cell, row }) => {
      return !row.original.materialDesc ? (
        <span>
          <span style={{ color: "red" }}>מק''ט לא קיים </span>
        </span>
      ) : (
        <TextTooltip
          title={cell.getValue<string>()}
          text={cell.getValue<string>()}
        />
      );
    },
  },

  {
    id: "materialUserDesc",
    accessorKey: "materialUserDesc",
    enableClickToCopy: true,
    header: "תיאור",
    size: 150,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
  {
    accessorKey: "quantity",
    id: "quantity",
    enableClickToCopy: true,
    header: "כמות",
    size: 150,
    Cell: ({ cell }) => (
      <TextTooltip
        title={cell.getValue<string>()}
        text={cell.getValue<string>()}
      />
    ),
  },
];
