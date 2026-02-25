import { Kshirut } from "./params.types";

export const Qualification = {
  "01": { text: "כשיר", class: "qualified" },
  "02": { text: "לא כשיר", class: "not-qualified" },
  "03": { text: "לא רלוונטי", class: "not-relevant" },
  "": { text: "", class: "" },
};

export const War_Qualification = {
  "01": { value: "01", text: "כשיר מלחמה", class: "qualified" },
  "02": {
    value: "02",
    text: "לא כשיר מלחמה",
    class: "not-war-qualified",
  },
  "03": { value: "03", text: "לא רלוונטי", class: "not-relevant" },
  "": { value: "0", text: "", class: "" },
};

export const Zminut = {
  "01": { value: "01", text: "זמין", class: "qualified" },
  "02": { value: "02", text: "לא זמין", class: "not-war-qualified" },
  "03": { value: "03", text: "לא רלוונטי", class: "not-relevant" },
  "": { value: "0", text: "", class: "" },
};

export interface IKshirutData {
  equipment: string;
  tplnrRoutine: string;
  tplnrWar: string;
  locationDescRoutine?: string;
  locationDescWar?: string;
  pluga: string;
  secPlatform: string;
  job: string;
  phisicalLocation: string;
  phisicalLocationDesc: string;
  isAgamForce: boolean;
  isAgamForceFromMaterial: boolean;
  isLogisticForce: boolean;
  kshirut: Kshirut;
  warKshirut: Kshirut;
  zminut: string;
  isManeuveringGdud?: boolean;
  equnrDesc: string;
  material: string;
  equipmentTask: string;
  decidingNonKshirutCause: string;
  openFaults: number;
}

export type UpdateKshirutData = IKshirutData & {
  changeTimestamp?: string;
};
