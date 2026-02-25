import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useAlertify } from "../../../../contexts/AlertContext";
import { useCurrentPath } from "../../../../shared/hooks/useCurrentPath";
import { useCustomScreenActions } from "../../../hooks/useCustomScreenActions";
import { useDeleteScreen } from "../../../services/screen/useDeleteScreen";
import {
  ComponentSettingMode,
  componentSettingModeState,
} from "../../../stores/componentSettingMode.store";
import { ScreenMode, screenModeState } from "../../../stores/screenMode.store";
import ComponentSetting from "../../ComponentSetting/ComponentSetting";
import "./ActionButtons.scss";

const ActionButtons = () => {
  const [screenMode, setScreenMode] = useRecoilState(screenModeState);
  const [open, setOpen] = useState<boolean>(false);
  const setComponentMode = useSetRecoilState<ComponentSettingMode>(
    componentSettingModeState
  );
  const { handleSubmitScreenActions } = useCustomScreenActions();

  const currentScreen = useCurrentPath();
  const { alertify } = useAlertify();
  const { mutate: mutateDeleteScreen } = useDeleteScreen();

  const handleDeleteScreen = async () => {
    mutateDeleteScreen({ screenId: currentScreen });
  };

  const openMessage = () => {
    alertify({
      messageType: "Info",
      msgContent: { message: "האם הינך בטוח שברצונך למחוק את המסך?" },
      buttons: [
        {
          text: "מחק",
          variant: "contained",
          onClick: handleDeleteScreen,
        },
        {
          text: "בטל",
          variant: "contained",
          onClick: () => {},
        },
      ],
    });
  };

  const addComponent = () => {
    handleSubmitScreenActions();
    setComponentMode(ComponentSettingMode.New);
    setOpen(true);
  };

  return (
    <>
      <div className="action-buttons">
        {screenMode === ScreenMode.Edit ? (
          <Button
            className="action-buttons__button edit"
            startIcon={<SaveIcon />}
            onClick={() => {
              setScreenMode(ScreenMode.ReadOnly);
              setComponentMode(ComponentSettingMode.View);
              handleSubmitScreenActions();
            }}
          >
            שמירה
          </Button>
        ) : (
          <Button
            className="action-buttons__button edit"
            onClick={() => {
              setScreenMode(ScreenMode.Edit);
              setComponentMode(ComponentSettingMode.Edit);
            }}
          >
            עריכה
          </Button>
        )}
        {screenMode === ScreenMode.Edit && (
          <>
            <Button
              className="action-buttons__button delete"
              startIcon={<DeleteIcon />}
              onClick={openMessage}
            >
              מחיקה
            </Button>
            <button
              className="action-buttons__button add"
              onClick={addComponent}
            >
              + הוספת רכיב
            </button>
          </>
        )}
      </div>

      <ComponentSetting
        open={open}
        setOpen={setOpen}
        mode={ComponentSettingMode.New}
        componentId={""}
      />
    </>
  );
};

export default ActionButtons;
