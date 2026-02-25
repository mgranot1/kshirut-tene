export enum MaterialTypes {
  NoStatus = "",
  Missing = "01",
  Created = "02",
  Supplied = "03",
}

export interface IMean {
  faultNum: string;
  quantity: number;
  sequenceNumber: number;
  material: string;
  materialDesc: string;
  materialDbDesc: string;
  missingParts: MaterialTypes;
  isValid: boolean;
}
export type IMeanUpdate = IMean & {
  changeTimestamp?: string;
};

export interface IMeanErr extends IMean {
  isEmpty: boolean;
  isEdited: boolean;
  isDuplicateMkt: boolean;
}
