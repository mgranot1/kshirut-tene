import {
  Button,
  ClickAwayListener,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import React from "react";
import { toast } from "react-hot-toast";
import "../UpdateEquipmentDialog/FeatureRow.scss";
import "../UpdateEquipmentDialog/UpdateEquipmentDialog.scss";

export type props = {
  open: boolean;
  dialogProps?: Partial<DialogProps>;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  title?: string
};

export const TableVariantCreateDialog = ({
  open = false,
  dialogProps,
  title,
  onSave,
  onCancel,
}: props) => {
  const [name, setName] = React.useState<string>("");

  const handleSave = () => {
    if (!name || name.length === 0) {
      toast.error("יש להזין שם", {icon: "❗"})
      return;
    }

    onSave?.(name)
    setName('')
  }

  return (
    <Dialog
      open={open}
      className="update-equipment-dialog"
      classes={{ paper: "update-equipment-dialog__paper small" }}
      PaperProps={
        {
          style: {
            height: '13rem'
          }
        }
      }
      {...dialogProps}
    >
    <ClickAwayListener onClickAway={(e) => {
      onCancel?.();
      setName('');
    }}>
      <div>
      <DialogTitle className="update-equipment-dialog__title">
        <span>{title ? title : 'יצירת ווריאנט'}</span>
      </DialogTitle>
      <DialogContent>
        <div className="feature-row">
          <div className="feature-row__input">
            <TextField
              className="feature-row__value rounded"
              placeholder="שם הווריאנט"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            ></TextField>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="update-equipment-dialog__actions">
        <Button
          className="update-equipment-dialog__cancel"
          variant="contained"
          onClick={() => {onCancel?.(); setName('')}}
        >
          ביטול
        </Button>
        <Button
          className="update-equipment-dialog__save"
          variant="contained"
          onClick={handleSave}
        >
          שמירה
        </Button>
      </DialogActions>
      </div>
    </ClickAwayListener>
    </Dialog>
  );
};

export default TableVariantCreateDialog;
