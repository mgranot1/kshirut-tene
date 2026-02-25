import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useAlertify } from "../../../contexts/AlertContext";
import TsavIrgunService from "../../../shared/services/tsavIrgunService/tsavIrgun.service";
import { paramsAtom } from "../../../shared/stores/params.store";
import useMassiveDashboardDataChange from "../../services/dashboard/useMassiveDashboardDataChange";
import { dashboardGeneralDataAtom } from "../../stores/DashboardData.store";
import { orgTreeAtom } from "../../stores/orgLevelTree.store";
import { OrgLevelCode } from "../../types/dashboardOrgLevel.types";
import { DashboardEquipmentRow } from "../../types/EquipmentTable.types";
import { GeneralDashboardTableRow } from "../../types/generalTable.types";
import {
  EmptyFeatureKey,
  Feature,
  FeatureMap,
} from "../../types/updateEquipment.type";
import Features from "./Features";
import "./UpdateEquipmentDialog.scss";

interface IUpdateEquipmentDialogProps {
  equipments: GeneralDashboardTableRow[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogProps?: Partial<DialogProps>;
  onDialogComplete: () => void;
}

const UpdateEquipmentDialog = ({
  equipments,
  open,
  setOpen,
  dialogProps,
  onDialogComplete,
}: IUpdateEquipmentDialogProps) => {
  const setGeneralData = useSetRecoilState(dashboardGeneralDataAtom);
  const params = useRecoilValue(paramsAtom);
  const orgTree = useRecoilValue(orgTreeAtom);
  const { alertify } = useAlertify();

  // Fields that can be features to massively change
  type MassiveFeatureKeys = keyof Pick<
    DashboardEquipmentRow,
    | "warTplnr"
    | "equipmentTask"
    | "pluga"
    | "physicalLocation"
    | "physicalLocationDetails"
    | "job"
  >;

  // State of the selected features
  const [features, setFeatures] = useState<Feature<MassiveFeatureKeys>[]>([
    {
      id: "",
      value: "",
    },
  ]);

  const { mutate: mutateMassiveDashboardDataChange } =
    useMassiveDashboardDataChange();

  // Configuration map of the equipment dialog's Feature component.
  // The id's of the features can only be the ones specified
  const featureMap = useMemo<FeatureMap<MassiveFeatureKeys>>(
    () => ({
      [EmptyFeatureKey]: {
        id: "",
        options: async () => {
          return [];
        },
        title: "בחירת מאפיין",
      },
      warTplnr: {
        id: "warTplnr",
        title: "ציוות קרבי",
        canBeEmpty: true,
        options: async () => {
          const emergencyGduds = await TsavIrgunService.getEmergencyGduds();
          return [{ label: "", value: "" }, ...emergencyGduds];
        },
      },
      equipmentTask: {
        id: "equipmentTask",
        title: "משימת הכלי",
        canBeEmpty: true,
        options: async () => params.equipmentTask,
      },
      physicalLocation: {
        id: "physicalLocation",
        title: "מיקום פיזי",
        canBeEmpty: true,
        options: async () => params.physicalLocation,
      },
      physicalLocationDetails: {
        id: "physicalLocationDetails",
        title: "תיאור מיקום פיזי",
        canBeEmpty: true,
        config: { maxLength: 40 },
      },
      job: {
        id: "job",
        title: "תפקיד/סימון הכלי",
        canBeEmpty: true,
        config: { maxLength: 40 },
      },
      pluga: {
        id: "pluga",
        title: "פלוגה",
        config: { maxLength: 40 },
      },
    }),
    []
  );

  const handleSave = async () => {
    if (features.length === 0) {
      return;
    }

    if (
      features.some((feature) => {
        const canBeEmpty: boolean = featureMap[feature.id].canBeEmpty || false;
        return feature.id === "" || (!canBeEmpty && !feature.value);
      })
    ) {
      toast("בבקשה מלאו את כל השדות הנבחרים והדרושים", { icon: "❗" });
      return;
    }

    setOpen(false);
    mutateMassiveDashboardDataChange({
      equipments: equipments,
      edit: features,
      operation: orgTree?.[OrgLevelCode.TREE_TYPE][0]?.value ?? "",
    });

    onDialogComplete();
  };

  return (
    <Dialog
      {...dialogProps}
      open={open}
      className="update-equipment-dialog"
      classes={{ paper: "update-equipment-dialog__paper" }}
    >
      <DialogTitle className="update-equipment-dialog__title">
        <span>עדכון נתוני צ' </span>
        <span className="update-equipment-dialog__amount">
          {`(${equipments.length} כלים)`}
        </span>
      </DialogTitle>
      <DialogContent>
        <Features<MassiveFeatureKeys>
          featureMap={featureMap}
          features={features}
          setFeatures={setFeatures}
        />
      </DialogContent>
      <DialogActions className="update-equipment-dialog__actions">
        <Button
          className="update-equipment-dialog__cancel"
          onClick={() => setOpen(false)}
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
    </Dialog>
  );
};

export default UpdateEquipmentDialog;
