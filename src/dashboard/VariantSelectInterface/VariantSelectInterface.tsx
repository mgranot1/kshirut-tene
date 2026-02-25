import TrashIcon from "@assets/dashboard/trash.svg";
import ClearIcon from "@mui/icons-material/Clear";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import React from "react";
import DashboardDropdown from "../../shared/components/DashboardDropdown/DashboardDropdown";
import TableVariantCreateDialog from "../components/VariantCreateDialog/VariantCreateDialog";
import { IGeneralVariant } from "../types/variant.types";
import "./VariantSelectInterface.scss";

export interface props<T extends IGeneralVariant> {
  variantList: T[];
  activeVariantIndex: number | null;
  onDeleteVariant?: (variantId: number, index: number) => void;
  onChooseVariant?: (variandId: number, index: number) => void;
  onRename?: ({
    variantId,
    index,
    name,
  }: {
    variantId: number;
    index: number;
    name: string;
  }) => void;
  onClear?: () => void;
  ContainerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

export const VariantSelectInterface = <T extends IGeneralVariant>({
  variantList,
  activeVariantIndex,
  onDeleteVariant,
  onChooseVariant,
  onRename,
  onClear,
  ContainerProps,
}: props<T>) => {
  const [openVariantSelect, setOpenVariantSelect] =
    React.useState<boolean>(false);
  const [openVariantRename, setOpenVariantRename] =
    React.useState<boolean>(false);
  return (
    <div className="variant-select-interface__container" {...ContainerProps}>
      {activeVariantIndex !== null && (
        <div className="variant-chip">
          <span>{variantList[activeVariantIndex].variantDescription}</span>
          <img
            src={TrashIcon}
            onClick={() => {
              onDeleteVariant?.(
                variantList[activeVariantIndex].variantId,
                activeVariantIndex
              );
            }}
          />
          <EditOutlinedIcon
            onClick={() => setOpenVariantRename(true)}
            fontSize="small"
          />
          <ClearIcon onClick={() => onClear?.()} fontSize="small" />
        </div>
      )}
      <DashboardDropdown
        resettable={false}
        options={variantList.map((variant) => ({
          label: variant.variantDescription,
          value: variant.variantId.toString(),
        }))}
        values={[{ label: "בחר וריאנט", value: "" }]}
        placeholder=""
        title={"בחר וריאנט"}
        style="border white"
        onSelect={(_, index) => {
          if (index === undefined) {
            onClear?.();
            return;
          }
          onChooseVariant?.(variantList[index].variantId, index);
        }}
        searchContainerProps={{
          style: {
            height: "100%",
            minWidth: "7.5vw",
            fontWeight: "500",
            color: "var(--dashboard-field-text-color)",
            padding: "0 15px",
            maxHeight: "2.25rem",
          },
        }}
        textFieldProps={{ inputProps: { maxLength: 20 } }}
        open={openVariantSelect}
        onLabelClick={setOpenVariantSelect}
        onOuterClick={() => setOpenVariantSelect(false)}
      />
      <TableVariantCreateDialog
        open={openVariantRename && activeVariantIndex !== null}
        onSave={(name) => {
          onRename?.({
            index: activeVariantIndex!,
            variantId: variantList[activeVariantIndex!].variantId,
            name,
          });
          setOpenVariantRename(false);
        }}
        dialogProps={{
          container: () => document.getElementById("createVariant-container"),
        }}
        onCancel={() => setOpenVariantRename(false)}
        title='עדכון וריאנט'
      />
    </div>
  );
};

export default VariantSelectInterface;
