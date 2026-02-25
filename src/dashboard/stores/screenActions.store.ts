import { atom } from "recoil";
import { TScreenActions } from "../services/screen/screen.service";

export const defaultScreenAction: TScreenActions = {
  id: "",
  compMeta: [],
};

export const screenActionsState = atom<TScreenActions>({
  key: "screenActionsState",
  default: defaultScreenAction,
});
