import { Kshirut } from "./params.types";

export interface IZadikData {
  equipment: string;
  mainPlatform: string;
  mainPlatformDesc: string;
  tplnrRoutine: string;
  tplnrWar: string;
  secPlatform: string;
  secPlatformDesc: string;
  kshirut: Kshirut;
  warKshirut: Kshirut;
  zminut: string;
  equnrDesc: string;
  openFaults: number;
  material: string;
  materialFamily: string;
  familyCodeDesc: string;
  fromRoutine: boolean;
  fromWar: boolean;
  isManeuveringGdud: boolean;
  lastUpdateTimestamp: Date;
  phisicalLocationDesc: string;
  phisicalLocation: string;
  maamad: string;
  maamadDesc: string;
  purpose: string;
  purposeDesc: string;
}
