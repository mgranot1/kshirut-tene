import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { DASHBOARD_PREFIX } from "../../../router/router.constant";
import { SitePaths } from "../../../router/routes";
import { QueryKeys } from "../../../shared/types/query.types";
import {
  defaultScreenAction,
  screenActionsState,
} from "../../stores/screenActions.store";
import { IScreen } from "../../types/screen.types";
import ScreenService, { TScreenActions } from "./screen.service";

export const useDeleteScreen = () => {
  const setScreenActions =
    useSetRecoilState<TScreenActions>(screenActionsState);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteScreen"],
    mutationFn: (variables: { screenId: IScreen["id"] }) =>
      ScreenService.deleteScreen(variables.screenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GetScreens] });
      setScreenActions(defaultScreenAction);
      navigate(`${DASHBOARD_PREFIX}/${SitePaths.TOP_VIEW}`);
      toast.success("המסך נמחק בהצלחה");
    },

    onError: (error: any) => {
      toast.error(`${error?.response?.data?.message ?? "שגיאה"}`);
    },
  });
};
