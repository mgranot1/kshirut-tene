import { atom } from "recoil";

export enum KshirutType {
  Routine = "kshirut",
  War = "warKshirut",
}

export type kshirutOption = {
  value: KshirutType;
  label: string;
};

export const kshirutTypeState = atom<kshirutOption>({
  key: "kshirutTypeState",
  default: { value: KshirutType.War, label: "כשירות מלחמה" },
});
