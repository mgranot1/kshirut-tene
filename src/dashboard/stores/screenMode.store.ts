import { atom } from "recoil";

export enum ScreenMode {
  Edit = "edit",
  ReadOnly = "readOnly",
}

export const screenModeState = atom<ScreenMode>({
  key: "screenModeState",
  default: ScreenMode.ReadOnly,
});
