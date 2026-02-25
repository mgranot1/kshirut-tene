import { atom } from "recoil";
import { IUserUnit } from "../types/userUnit.types";

export const userUnitState = atom<IUserUnit>({
  key: "userUnitState",
  default: {} as IUserUnit,
});
