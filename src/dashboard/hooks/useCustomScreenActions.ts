import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import ScreenService, {
  TScreenActions,
} from "../services/screen/screen.service";
import {
  defaultScreenAction,
  screenActionsState,
} from "../stores/screenActions.store";

export const useCustomScreenActions = () => {
  const [screenActions, setScreenActions] =
    useRecoilState<TScreenActions>(screenActionsState);

  const handleSubmitScreenActions = () => {
    if (!screenActions.compMeta.length) return;

    toast.promise(ScreenService.updateScreenComponents(screenActions), {
      loading: "שמירת רכיבי מסך",
      success: () => {
        setScreenActions(defaultScreenAction);
        return "נשמר בהצלחה";
      },
      error: (error) => {
        return `${error?.response?.data?.message ?? "שגיאה"}`;
      },
    });
  };

  return { handleSubmitScreenActions };
};
