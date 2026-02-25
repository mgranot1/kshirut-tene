import { IOption } from "../../shared/types/general.types";
import { IMean, IMeanUpdate } from "../../shared/types/mean.types";
import { IComment } from "./comment.types";
import { IHH, IHHUpdate } from "./hh.types";

export enum Extras {
  mean = "אמצעי",
  part = 'ח"ח',
}

export interface IExtras {
  extraType: IOption;
  type: IOption;
  quantity: number | undefined;
}

export interface IFault {
  faultNum: string;
  equipment: string;
  faultStatus: string;
  essence: string;
  expectedTime: string;
  grindType: string;
  availabilityInhibitor: string;
  contact: string;
  phoneNumber: string;
  mobileAbility: string;
  note: string;
  dereg: string;
  squad: string;
  reqSquad: string;
  phisicalLocation: string;
  phisicalLocationDesc: string;
  transportationType: string;
  createTimestamp?: Date;
  createUser?: string;
  changeTimestamp?: Date;
  changeUser?: string;
  comments: IComment[];
  hhs: IHH[];
  means: IMean[];
}

export const emptyIFault : IFault = {
faultNum: '',
availabilityInhibitor: '',
comments: [],
contact: '',
dereg: '',
equipment: '',
essence: '',
expectedTime: '',
faultStatus: '',
grindType: '',
hhs: [],
means: [],
mobileAbility: '',
note: '',
phisicalLocation: '',
phisicalLocationDesc: '',
phoneNumber: '',
reqSquad: '',
squad: '',
transportationType: ''
}

export type IFaultUpdate = Omit<
  IFault,
  "comments" | "hhs" | "means" | "changeTimestamp"
> & {
  changeTimestamp?: string;
  hhs: IHHUpdate[];
  means: IMeanUpdate[];
};

export type IFaultCreate = Omit<IFault, "comments" | "changeTimestamp"> & {
  changeTimestamp?: string;
};
export interface IMaterialDesc {
  material: string;
  materialDesc: string;
}
