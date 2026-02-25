import { atom } from "recoil";
import { Params } from "../services/param/useGetValuesRange";

export const paramsAtom = atom<Params>({
  key: "param",
  default: {} as Params,
});
