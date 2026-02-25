import { atom } from "recoil";

export const triggerReloadState = atom<boolean>({
  key: "triggerReloadState",
  default: false,
});
