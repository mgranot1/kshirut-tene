import { MaterialTypes } from "../../shared/types/mean.types";

export interface IHH {
  faultNum: string;
  material: string;
  materialDesc: string;
  materialDbDesc: string;
  quantity: number;
  missingParts: MaterialTypes;
  sequenceNumber: number;
  isValid: boolean;
}

export type IHHUpdate = IHH & {
  changeTimestamp?: string;
};

export type IHHRes = Omit<IHH, "isValid"> & {
  isValid: string;
};

export interface IHHErr extends IHH {
  isEmpty: boolean;
  isEdited: boolean;
  isDuplicateMkt: boolean;
}
