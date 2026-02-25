import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { DASHBOARD_PREFIX } from "../../../router/router.constant";
import { QueryKeys } from "../../../shared/types/query.types";
import {
  MatomoCategory,
  matomoEvent,
} from "../../../shared/utils/matomo.utils";
import useGetScreens from "../../services/screen/useGetScreens";
import { useUpsertScreen } from "../../services/screen/useUpsertScreen";
import { ScreenMode, screenModeState } from "../../stores/screenMode.store";
import { IScreen } from "../../types/screen.types";
import { CUSTOM_SCREEN_PATH } from "../layout/ScreenRecord/ScreenRecord";
import MultiStepPopUp from "../MultiStepPopUp/MultiStepPopUp";
import ScreenSettingContent from "./ScreenSettingContent";

interface IScreenSettingProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  currentScreenId: string;
}

export const isEmptyString = (str: string) => {
  return str.trim() === "";
};

export const emptyScreen: IScreen = {
  id: "",
  name: "",
  categoryId: "",
  categoryName: "",
  color: "#000000",
} as IScreen;

const ScreenSetting = ({
  open,
  setOpen,
  currentScreenId,
}: IScreenSettingProps) => {
  const { data: screens } = useGetScreens();
  const navigate = useNavigate();
  const setScreenMode = useSetRecoilState<ScreenMode>(screenModeState);
  const queryClient = useQueryClient();

  const [currentScreen, setCurrentScreen] = useState<IScreen>(
    (screens ?? []).find((screen) => screen.id === currentScreenId) ??
      emptyScreen
  );

  const title = currentScreenId ? "הגדרת מסך" : "הגדרת מסך חדש";

  const onSuccessUpdateScreen = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.GetScreens] });
    setOpen(false);
    toast.success("המסך נשמר בהצלחה");
  };

  const onSuccessCreateScreen = (responseData: IScreen) => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.GetScreens] });

    if (currentScreenId) {
      navigate(`../${CUSTOM_SCREEN_PATH}/${responseData.id}`);
    } else {
      setScreenMode(ScreenMode.Edit);
      navigate(
        `../${DASHBOARD_PREFIX}/${CUSTOM_SCREEN_PATH}/${responseData.id}`
      );
    }

    setOpen(false);
    toast.success("המסך נשמר בהצלחה");
  };

  const onErrorUpsertScreen = (error) => {
    setOpen(false);
    setCurrentScreen(emptyScreen);
    toast.error(`${error?.response?.data?.message ?? "שגיאה"}`);
  };

  const { mutate: mutateUpsertScreen } = useUpsertScreen({
    onSuccess: currentScreenId ? onSuccessUpdateScreen : onSuccessCreateScreen,
    onError: onErrorUpsertScreen,
  });

  const handleSubmit = (screen: IScreen) => {
    matomoEvent("edit screen", MatomoCategory.ClICK, screen.name, 0);
    if (isEmptyString(screen.name) || isEmptyString(screen.categoryName)) {
      toast.error("מלא שדות חובה");
      return;
    }
    mutateUpsertScreen(screen);
  };

  return (
    <>
      <MultiStepPopUp
        open={open}
        steps={[
          {
            title: title,
            content: (
              <ScreenSettingContent
                screen={currentScreen}
                setScreen={setCurrentScreen}
              />
            ),
          },
        ]}
        onClose={() => {
          setOpen((prev) => !prev);
          setCurrentScreen(emptyScreen);
        }}
        onSubmit={() => {
          handleSubmit(currentScreen);
        }}
      />
    </>
  );
};

export default ScreenSetting;
