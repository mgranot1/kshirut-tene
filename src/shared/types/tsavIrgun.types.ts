import { OrgLevelCode } from "../../dashboard/types/dashboardOrgLevel.types";

export interface ITsavIrgunLevel {
  index: number;
  funcLoc: string;
  funcLocDesc: string;
  levelDesc: string;
  hierLevel: OrgLevelCode;
  fatherIndex: number;
  objid: string;
  simulToari: string;
  relevantSimuls: string[];
}

export interface IOperation {
  code: string;
  description: string;
}

export type TsavIdentifier = keyof Pick<ITsavIrgunLevel, 'objid' | 'funcLoc'>
