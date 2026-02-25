import { atom } from "recoil";

export enum ComponentSettingMode {
  View,
  Edit,
  New,
}

export const componentSettingModeState = atom<ComponentSettingMode>({
  key: "componentSettingModeState",
  default: ComponentSettingMode.View,
});
