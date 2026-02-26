import { atom } from "recoil";

export const selectedComponentsState = atom<string[]>({
    key: "selectedComponentsState",
    default: [],
});
