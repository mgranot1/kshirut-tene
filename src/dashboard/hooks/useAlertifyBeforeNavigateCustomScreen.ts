import { useRecoilState } from "recoil";
import { useAlertify } from "../../contexts/AlertContext";
import { TScreenActions } from "../services/screen/screen.service";
import {
  defaultScreenAction,
  screenActionsState,
} from "../stores/screenActions.store";
import { ScreenMode, screenModeState } from "../stores/screenMode.store";

export const useAlertifyBeforeNavigateCustomScreen = () => {
  const { alertify } = useAlertify();
  const [screenActions, setScreenActions] =
    useRecoilState<TScreenActions>(screenActionsState);
  const [screenMode, setScreenMode] = useRecoilState(screenModeState);

  const navigateFromCustomScreen = (handleAction: (value?: any) => void) => {
    if (screenMode === ScreenMode.Edit && screenActions.compMeta.length) {
      alertify({
        messageType: "Info",
        msgContent: { message: "בוצעו שינויים במסך, יש לבצע שמירה" },
        buttons: [
          {
            text: "בטל שינויים",
            variant: "contained",
            onClick: () => {
              setScreenActions(defaultScreenAction);
              setScreenMode(ScreenMode.ReadOnly);
              handleAction();
            },
          },
        ],
      });
    } else {
      setScreenMode(ScreenMode.ReadOnly);
      handleAction();
    }
  };

  return { navigateFromCustomScreen };
};
