export interface ILog {
  logType: string;
  logTypeKey: string;
  field: string;
  changeTimestamp: Date;
  watchedUser: string;
  newValue: string;
  zadikNumber: string;
}

export enum ZadikLogField {
  "PLUGA" = "פלוגה",
  "JOB" = "תפקיד/סימון הכלי",
  "PHISICAL_LOCATION" = "מיקום פיזי",
  "AGAM_FORCE" = "מכפיל כח אגמי",
  "LOGISTIC_FORCE" = "מכפיל כח לוגיסטי",
  "KSHIRUT" = "כשירות",
  "WAR_KSHIRUT" = "כשירות מלחמה",
  "TPLNR_OPER" = "ציוות קרבי",
  "WAR_STATUS" = `סטטוס מלחמה`,
  "PHISICAL_LOCATION_DESC" = "תיאור מיקום פיזי",
  "EQUIPMENT_TASK" = "משימת הכלי",
  "DECIDING_NON_KSHIRUT_CAUSE" = "סיבת אי כשירות קובעת",
}

export enum GdudLog {
  "01" = "גדוד בלחימה",
  "02" = "גדוד לא בלחימה",
}

export enum LogTypes {
  Zadik = "01",
  Gdud = "02",
  Fault = "03",
  Chat = "04",
  HhEmz = "05",
}
