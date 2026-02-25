import { atom } from "recoil";
import IGdud from "../types/gdud.types";

export const maneuveringGdudState = atom<IGdud | undefined>({
  key: "maneuveringGdudState",
  default: undefined,
});
