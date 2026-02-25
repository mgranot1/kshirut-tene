/**
 * Demo data for running the app without a backend.
 * All data is fake and for design/UI purposes only.
 */

import { Kshirut } from "../shared/types/params.types";
import { HierLevel } from "../dashboard/types/family.types";
import { ComponentType } from "../dashboard/types/component.types";

// ---- User Unit ----
export const demoUserUnit = {
  username: "demo_user",
  routineLevel: "50000001",
  routineLevelDesc: "פיקוד צפון",
  emergencyLevel: "60000001",
  emergencyLevelDesc: "פיקוד צפון - חירום",
  objid: "OBJ001",
  operationCode: "OP01",
};

// ---- Families ----
export const demoFamilies = [
  {
    code: "FAM01",
    description: 'משפחת נגמ"שים',
    hierLevel: HierLevel.Family,
    parentCode: "",
  },
  {
    code: "FAM02",
    description: "משפחת טנקים",
    hierLevel: HierLevel.Family,
    parentCode: "",
  },
  {
    code: "FAM03",
    description: "משפחת רכב קל",
    hierLevel: HierLevel.Family,
    parentCode: "",
  },
  {
    code: "PLT01",
    description: "נמר",
    hierLevel: HierLevel.Platform,
    parentCode: "FAM01",
  },
  {
    code: "PLT02",
    description: "מרכבה 4",
    hierLevel: HierLevel.Platform,
    parentCode: "FAM02",
  },
  {
    code: "PLT03",
    description: "האמר",
    hierLevel: HierLevel.Platform,
    parentCode: "FAM03",
  },
  {
    code: "SUB01",
    description: "נמר 2",
    hierLevel: HierLevel.SubPlatform,
    parentCode: "PLT01",
  },
  {
    code: "MAT01",
    description: "חומר 1",
    hierLevel: HierLevel.Material,
    parentCode: "SUB01",
  },
];

// ---- Parameters (value ranges) ----
export const demoParams: Record<
  string,
  { fieldname: string; key: string; value: string }[]
> = {
  PM_EXPECTED_TIME_D: [
    { fieldname: "expectedTime", key: "01", value: "עד 6 שעות" },
    { fieldname: "expectedTime", key: "02", value: "עד 12 שעות" },
    { fieldname: "expectedTime", key: "03", value: "עד 24 שעות" },
    { fieldname: "expectedTime", key: "04", value: "עד 48 שעות" },
    { fieldname: "expectedTime", key: "05", value: "עד 72 שעות" },
    { fieldname: "expectedTime", key: "06", value: "מעל 72 שעות" },
    { fieldname: "expectedTime", key: "07", value: "מחוץ למלחמה" },
  ],
  PM_GRIND_D: [
    { fieldname: "grindType", key: "01", value: "טכני" },
    { fieldname: "grindType", key: "02", value: "מבצעי" },
  ],
  PM_KSH_DEREG_D: [
    { fieldname: "dereg", key: "01", value: "דרג א" },
    { fieldname: "dereg", key: "02", value: "דרג ב" },
    { fieldname: "dereg", key: "03", value: "דרג ג" },
  ],
  PM_KSH_PH_LOCATION_D: [
    { fieldname: "physicalLocation", key: "01", value: "בשטחנו" },
    { fieldname: "physicalLocation", key: "02", value: "במרחב הקרבי" },
    { fieldname: "physicalLocation", key: "03", value: "אגד" },
    { fieldname: "physicalLocation", key: "04", value: 'מש"א' },
    { fieldname: "physicalLocation", key: "05", value: "תעשיות" },
    { fieldname: "physicalLocation", key: "06", value: 'ימ"ה מבצעית' },
  ],
  PM_KSH_ABILITY_MOBILE_D: [
    { fieldname: "mobileAbility", key: "01", value: "ניידות עצמאית" },
    { fieldname: "mobileAbility", key: "02", value: "ניידות לא עצמאית" },
  ],
  PM_KSH_FAULT_STATUS_D: [
    { fieldname: "faultStatus", key: "01", value: "נפתחה" },
    { fieldname: "faultStatus", key: "02", value: "בעבודה" },
    { fieldname: "faultStatus", key: "03", value: "הועברה לדרג גבוה" },
    { fieldname: "faultStatus", key: "04", value: 'ממתינה לח"ח' },
    { fieldname: "faultStatus", key: "05", value: "ממתינה לחילוץ" },
    { fieldname: "faultStatus", key: "06", value: "ממתינה לצוות" },
    { fieldname: "faultStatus", key: "07", value: "ממתינה לתחזוקה" },
    { fieldname: "faultStatus", key: "08", value: "ממתינה להובלה" },
    { fieldname: "faultStatus", key: "09", value: "בוצעה" },
    { fieldname: "faultStatus", key: "10", value: "בוטלה" },
  ],
  PM_KSH_KSHIRUT: [
    { fieldname: "kshirut", key: "01", value: "כשיר" },
    { fieldname: "kshirut", key: "02", value: "לא כשיר" },
    { fieldname: "kshirut", key: "03", value: "לא רלוונטי" },
  ],
  PM_SYS_D: [
    { fieldname: "availabilityInhibitor", key: "01", value: "מערכת נשק" },
    { fieldname: "availabilityInhibitor", key: "02", value: "מערכת הנעה" },
    { fieldname: "availabilityInhibitor", key: "03", value: "מערכת חשמל" },
  ],
  PM_REQ_SQUAD_D: [
    { fieldname: "reqSquad", key: "01", value: "צוות א" },
    { fieldname: "reqSquad", key: "02", value: "צוות ב" },
  ],
  PM_KSH_TRANSPORT_TYPE_D: [
    { fieldname: "transportationType", key: "1", value: "נדרש כננת" },
  ],
  PM_DCD_NON_KSH_CAUSE: [
    { fieldname: "decidingNonKshirutCause", key: "01", value: "תקלה טכנית" },
    { fieldname: "decidingNonKshirutCause", key: "02", value: "חוסר חלקים" },
  ],
  PM_EQUIPMENT_TASK: [
    { fieldname: "equipmentTask", key: "01", value: "לחימה" },
    { fieldname: "equipmentTask", key: "02", value: "אימון" },
  ],
  PM_TAG: [
    { fieldname: "tags", key: "01", value: "תג 1" },
    { fieldname: "tags", key: "02", value: "תג 2" },
  ],
  PM_MISSING_PARTS: [
    { fieldname: "missingPartStatus", key: "01", value: "חסר" },
    { fieldname: "missingPartStatus", key: "02", value: "הוזמן" },
    { fieldname: "missingPartStatus", key: "03", value: "סופק" },
  ],
  MAAMAD: [
    { fieldname: "maamad", key: "01", value: "מעמד א" },
    { fieldname: "maamad", key: "02", value: "מעמד ב" },
  ],
  PURPOSE: [
    { fieldname: "purpose", key: "01", value: "ייעוד לחימה" },
    { fieldname: "purpose", key: "02", value: "ייעוד אימון" },
  ],
};

// ---- Tsav Irgun (Org Tree) ----
export const demoTsavIrgunRoutine = [
  {
    index: 1,
    funcLoc: "50000001",
    funcLocDesc: "פיקוד צפון",
    levelDesc: "פיקוד",
    hierLevel: 1,
    fatherIndex: 0,
    objid: "",
    simulToari: "",
    relevantSimuls: [],
  },
  {
    index: 2,
    funcLoc: "50000010",
    funcLocDesc: "אוגדה 91",
    levelDesc: "אוגדה",
    hierLevel: 2,
    fatherIndex: 1,
    objid: "",
    simulToari: "",
    relevantSimuls: [],
  },
  {
    index: 3,
    funcLoc: "50000100",
    funcLocDesc: "חטיבה 7",
    levelDesc: "חטיבה",
    hierLevel: 3,
    fatherIndex: 2,
    objid: "",
    simulToari: "",
    relevantSimuls: [],
  },
  {
    index: 4,
    funcLoc: "50000101",
    funcLocDesc: "50000101 - גדוד 71",
    levelDesc: "גדוד",
    hierLevel: 4,
    fatherIndex: 3,
    objid: "",
    simulToari: "SIM01",
    relevantSimuls: ["SIM01"],
  },
  {
    index: 5,
    funcLoc: "50000102",
    funcLocDesc: "50000102 - גדוד 72",
    levelDesc: "גדוד",
    hierLevel: 4,
    fatherIndex: 3,
    objid: "",
    simulToari: "SIM02",
    relevantSimuls: ["SIM02"],
  },
];

export const demoTsavIrgunEmergency = [
  {
    index: 1,
    funcLoc: "60000001",
    funcLocDesc: "פיקוד צפון - חירום",
    levelDesc: "פיקוד",
    hierLevel: 1,
    fatherIndex: 0,
    objid: "OBJ001",
    simulToari: "",
    relevantSimuls: [],
  },
  {
    index: 2,
    funcLoc: "60000010",
    funcLocDesc: "אוגדה 91 - חירום",
    levelDesc: "אוגדה",
    hierLevel: 2,
    fatherIndex: 1,
    objid: "OBJ002",
    simulToari: "",
    relevantSimuls: [],
  },
  {
    index: 3,
    funcLoc: "60000100",
    funcLocDesc: "חטיבה 7 - חירום",
    levelDesc: "חטיבה",
    hierLevel: 3,
    fatherIndex: 2,
    objid: "OBJ003",
    simulToari: "",
    relevantSimuls: [],
  },
];

export const demoOperations = [
  { code: "OP01", description: "מבצע חרבות ברזל" },
  { code: "OP02", description: "מבצע מגן צפוני" },
];

export const demoEmergencyGduds = [
  { funcLoc: "60000101", funcLocDesc: "גדוד 71 חירום" },
  { funcLoc: "60000102", funcLocDesc: "גדוד 72 חירום" },
];

// ---- Dashboard Equipment Data ----
const makeFault = (num: number, equipment: string) => ({
  faultNum: String(num).padStart(10, "0"),
  faultStatus: "02",
  essence: `תקלה ${num} - מערכת הנעה`,
  equipment,
  expectedTime: "03",
  contact: "ישראל ישראלי",
  phoneNumber: "050-1234567",
  dereg: "01",
  squad: "צוות 1",
  mobileAbility: "01",
  reqSquad: "01",
  note: "הערה לדוגמה",
  grindType: "01",
  availabilityInhibitor: "02",
  physicalLocation: "01",
  physicalLocationDetails: "בסיס 1",
  faultHh: [],
  faultEmz: [],
  transportationType: "",
  faultHhProblem: [],
  faultEmzProblem: [],
  createTimestamp: new Date("2026-01-15"),
  changeTimestamp: new Date("2026-02-20"),
});

export const demoDashboardEquipments = [
  {
    equipment: "000012345",
    description: "נמר מס' 101",
    kshirut: Kshirut.Kashir,
    warKshirut: Kshirut.Kashir,
    warTplnr: "60000101",
    conclusiveWarTplnr: "60000101",
    conclusiveWarTplnrDesc: "גדוד 71",
    routineTplnr: "50000101",
    routineTplnrDesc: "גדוד 71",
    warTplnrDesc: "60000101גדוד 71",
    isGdudManeuvering: true,
    material: "MAT01",
    materialFamily: "FAM01",
    materialFamilyDesc: 'משפחת נגמ"שים',
    mainPlatform: "PLT01",
    mainPlatformDesc: "נמר",
    secPlatform: "SUB01",
    secPlatformDesc: "נמר 2",
    isAgamForce: false,
    excFromWar: false,
    isLogisticForce: false,
    physicalLocation: "01",
    physicalLocationDetails: "בסיס 1",
    pikud: "50000001",
    pikudDesc: "פיקוד צפון",
    ugda: "50000010",
    ugdaDesc: "אוגדה 91",
    utzva: "50000100",
    utzvaDesc: "חטיבה 7",
    pluga: "פלוגה א",
    job: "לחימה",
    lastUpdateTimestamp: new Date("2026-02-24"),
    maamad: "01",
    maamadDesc: "מעמד א",
    purpose: "01",
    purposeDesc: "ייעוד לחימה",
    equipmentTask: "01",
    decidingNonKshirutCause: "",
    tags: ["01"],
    faults: [makeFault(1001, "12345")],
  },
  {
    equipment: "000012346",
    description: "מרכבה 4 מס' 202",
    kshirut: Kshirut.Not_Kashir,
    warKshirut: Kshirut.Not_Kashir,
    warTplnr: "60000101",
    conclusiveWarTplnr: "60000101",
    conclusiveWarTplnrDesc: "גדוד 71",
    routineTplnr: "50000101",
    routineTplnrDesc: "גדוד 71",
    warTplnrDesc: "60000101גדוד 71",
    isGdudManeuvering: true,
    material: "MAT02",
    materialFamily: "FAM02",
    materialFamilyDesc: "משפחת טנקים",
    mainPlatform: "PLT02",
    mainPlatformDesc: "מרכבה 4",
    secPlatform: "",
    secPlatformDesc: "",
    isAgamForce: true,
    excFromWar: false,
    isLogisticForce: false,
    physicalLocation: "02",
    physicalLocationDetails: "מרחב קרבי",
    pikud: "50000001",
    pikudDesc: "פיקוד צפון",
    ugda: "50000010",
    ugdaDesc: "אוגדה 91",
    utzva: "50000100",
    utzvaDesc: "חטיבה 7",
    pluga: "פלוגה ב",
    job: "אימון",
    lastUpdateTimestamp: new Date("2026-02-23"),
    maamad: "02",
    maamadDesc: "מעמד ב",
    purpose: "02",
    purposeDesc: "ייעוד אימון",
    equipmentTask: "02",
    decidingNonKshirutCause: "01",
    tags: ["02"],
    faults: [makeFault(1002, "12346"), makeFault(1003, "12346")],
  },
  {
    equipment: "000012347",
    description: "האמר מס' 303",
    kshirut: Kshirut.Kashir,
    warKshirut: Kshirut.Kashir,
    warTplnr: "60000102",
    conclusiveWarTplnr: "60000102",
    conclusiveWarTplnrDesc: "גדוד 72",
    routineTplnr: "50000102",
    routineTplnrDesc: "גדוד 72",
    warTplnrDesc: "60000102גדוד 72",
    isGdudManeuvering: false,
    material: "MAT03",
    materialFamily: "FAM03",
    materialFamilyDesc: "משפחת רכב קל",
    mainPlatform: "PLT03",
    mainPlatformDesc: "האמר",
    secPlatform: "",
    secPlatformDesc: "",
    isAgamForce: false,
    excFromWar: false,
    isLogisticForce: true,
    physicalLocation: "01",
    physicalLocationDetails: "בסיס 2",
    pikud: "50000001",
    pikudDesc: "פיקוד צפון",
    ugda: "50000010",
    ugdaDesc: "אוגדה 91",
    utzva: "50000100",
    utzvaDesc: "חטיבה 7",
    pluga: "פלוגה ג",
    job: "לוגיסטיקה",
    lastUpdateTimestamp: new Date("2026-02-22"),
    maamad: "01",
    maamadDesc: "מעמד א",
    purpose: "01",
    purposeDesc: "ייעוד לחימה",
    equipmentTask: "01",
    decidingNonKshirutCause: "",
    tags: [],
    faults: [],
  },
];

// ---- Zadik Data ----
export const demoZadiksData = [
  {
    equipment: "12345",
    mainPlatform: "PLT01",
    mainPlatformDesc: "נמר",
    tplnrRoutine: "50000101",
    tplnrWar: "60000101",
    secPlatform: "SUB01",
    secPlatformDesc: "נמר 2",
    kshirut: Kshirut.Kashir,
    warKshirut: Kshirut.Kashir,
    zminut: "01",
    equnrDesc: "נמר מס' 101",
    openFaults: 1,
    material: "MAT01",
    materialFamily: "FAM01",
    familyCodeDesc: 'משפחת נגמ"שים',
    fromRoutine: true,
    fromWar: true,
    isManeuveringGdud: true,
    lastUpdateTimestamp: new Date("2026-02-24"),
    phisicalLocationDesc: "בסיס 1",
    phisicalLocation: "01",
    maamad: "01",
    maamadDesc: "מעמד א",
    purpose: "01",
    purposeDesc: "ייעוד לחימה",
  },
  {
    equipment: "12346",
    mainPlatform: "PLT02",
    mainPlatformDesc: "מרכבה 4",
    tplnrRoutine: "50000101",
    tplnrWar: "60000101",
    secPlatform: "",
    secPlatformDesc: "",
    kshirut: Kshirut.Not_Kashir,
    warKshirut: Kshirut.Not_Kashir,
    zminut: "02",
    equnrDesc: "מרכבה 4 מס' 202",
    openFaults: 2,
    material: "MAT02",
    materialFamily: "FAM02",
    familyCodeDesc: "משפחת טנקים",
    fromRoutine: true,
    fromWar: true,
    isManeuveringGdud: true,
    lastUpdateTimestamp: new Date("2026-02-23"),
    phisicalLocationDesc: "מרחב קרבי",
    phisicalLocation: "02",
    maamad: "02",
    maamadDesc: "מעמד ב",
    purpose: "02",
    purposeDesc: "ייעוד אימון",
  },
];

// ---- Kshirut Data ----
export const demoKshirutData = {
  equipment: "12345",
  tplnrRoutine: "50000101",
  tplnrWar: "60000101",
  locationDescRoutine: "גדוד 71",
  locationDescWar: "גדוד 71 חירום",
  pluga: "פלוגה א",
  secPlatform: "SUB01",
  job: "לחימה",
  phisicalLocation: "01",
  phisicalLocationDesc: "בסיס 1",
  isAgamForce: false,
  isAgamForceFromMaterial: false,
  isLogisticForce: false,
  kshirut: Kshirut.Kashir,
  warKshirut: Kshirut.Kashir,
  zminut: "01",
  isManeuveringGdud: true,
  equnrDesc: "נמר מס' 101",
  material: "MAT01",
  equipmentTask: "01",
  decidingNonKshirutCause: "",
  openFaults: 1,
};

// ---- Screens ----
export const demoScreens = [
  {
    id: "SCR01",
    name: "מסך ראשי",
    categoryId: "CAT01",
    categoryName: "כללי",
    color: "#1976d2",
    creator: "demo_user",
    changeTimestamp: new Date("2026-02-20"),
    isShared: false,
  },
  {
    id: "SCR02",
    name: "מסך טנקים",
    categoryId: "CAT02",
    categoryName: "שריון",
    color: "#388e3c",
    creator: "demo_user",
    changeTimestamp: new Date("2026-02-18"),
    isShared: true,
  },
];

// ---- Categories ----
export const demoCategories = [
  { id: "CAT01", name: "כללי" },
  { id: "CAT02", name: "שריון" },
  { id: "CAT03", name: 'חי"ר' },
];

// ---- Materials ----
export const demoMaterials = [
  { material: "MAT01", materialDesc: "חומר נמר", parentCode: "SUB01" },
  { material: "MAT02", materialDesc: "חומר מרכבה", parentCode: "PLT02" },
  { material: "MAT03", materialDesc: "חומר האמר", parentCode: "PLT03" },
];

// ---- Variants ----
export const demoVariants = [
  {
    variantId: 1,
    variantDescription: "ברירת מחדל",
    type: 1,
    isGlobal: true,
    isDefault: true,
    values: [],
  },
];

// ---- Components ----
export const demoScreenComponents = [
  {
    id: "CMP01",
    compColumn: 0,
    compRow: 0,
    screenId: "SCR01",
    type: ComponentType.Pie as string,
  },
  {
    id: "CMP02",
    compColumn: 1,
    compRow: 0,
    screenId: "SCR01",
    type: ComponentType.PieWithExpected as string,
  },
  {
    id: "CMP03",
    compColumn: 3,
    compRow: 0,
    screenId: "SCR01",
    type: ComponentType.FreeText as string,
  },
];

export const demoComponentSettings: Record<string, any> = {
  CMP01: {
    id: "CMP01",
    name: "כשירות כללית",
    type: ComponentType.Pie,
    compColumn: 0,
    compRow: 0,
    screenId: "SCR01",
    toSevereThreshold: 50,
    toWarningThreshold: 75,
    filters: [],
  },
  CMP02: {
    id: "CMP02",
    name: "כשירות עם צפי",
    type: ComponentType.PieWithExpected,
    compColumn: 1,
    compRow: 0,
    screenId: "SCR01",
    toSevereThreshold: 50,
    toWarningThreshold: 75,
    filters: [],
  },
  CMP03: {
    id: "CMP03",
    name: "הערות מפקד",
    type: ComponentType.FreeText,
    compColumn: 3,
    compRow: 0,
    screenId: "SCR01",
    toSevereThreshold: 0,
    toWarningThreshold: 0,
    filters: [],
    freeTextData: {
      htmlContent:
        '<span style="font-weight:bold;color:#374768;font-size:18px;">שימו לב</span> — <span style="color:#d32f2f;">יש לעדכן כשירות עד סוף היום</span>',
      defaultFontSize: 16,
      defaultAlign: "right" as const,
    },
  },
};

export const demoComponentData = {
  "01": {
    id: "CMP01",
    name: "כשירות כללית",
    type: ComponentType.Pie,
    toSevereThreshold: 50,
    toWarningThreshold: 75,
    componentData: { kashir: 2, total: 3 },
  },
  "02": {
    id: "CMP02",
    name: "כשירות עם צפי",
    type: ComponentType.PieWithExpected,
    toSevereThreshold: 50,
    toWarningThreshold: 75,
    componentData: {
      kashir: 2,
      total: 3,
      kashirOn24: 2,
      kashirOn48: 3,
      kashirOn72: 3,
    },
  },
  "03": {
    id: "CMP03",
    name: "הערות מפקד",
    type: ComponentType.FreeText,
    toSevereThreshold: 0,
    toWarningThreshold: 0,
    componentData: {
      htmlContent:
        '<span style="font-weight:bold;color:#374768;font-size:18px;">שימו לב</span> — <span style="color:#d32f2f;">יש לעדכן כשירות עד סוף הי555555fffffffffמיכל ויעל עדכון גיטffffffffffffffffffffffffffffffffffff55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555ום</span>',
      defaultFontSize: 16,
      defaultAlign: "right" as const,
    },
  },
};

// ---- Top View Data ----
export const demoTopViewData = {
  cacheKey: "demo-cache-key",
  agamKshirutAmount: 1,
  agamKshirutTotal: 1,
  logisticKshirutAmount: 1,
  logisticKshirutTotal: 1,
  technicalGrinds: 2,
  grindFaultsCount: 3,
  operationalGrinds: 1,
  squadAwaitingFaultsCount: 1,
  squadAwaitingEquipsCount: 1,
  recoveryAwaitingFaultsCount: 0,
  recoveryAwaitingEquipsCount: 0,
  transportAwaitingFaultCount: 0,
  transportAwaitingEquipCount: 0,
  winchRequiredEquipsCount: 0,
  missingHhsCount: 0,
  equipmentsWithMissingCount: 0,
  invalidMissingHhsCount: 0,
  malfunEquipInOurAreaCount: 1,
  malfunEquipInEgedCount: 0,
  malfunEquipInMashaCount: 0,
  malfunEquipInIndustrCount: 0,
  malfunEquipInYamahCount: 0,
  malfuncEquipsInWar: 1,
  malfunEqIndependMobilCount: 1,
  faultsInOurAreaCount: 2,
  faultsInWarCount: 1,
  kshirutByFamily: [
    { code: "FAM01", title: 'משפחת נגמ"שים', total: 1, kshirim: 1 },
    { code: "FAM02", title: "משפחת טנקים", total: 1, kshirim: 0 },
    { code: "FAM03", title: "משפחת רכב קל", total: 1, kshirim: 1 },
  ],
  "24KashirEquipmentsCountPie": 2,
  "48KashirEquipmentsCountPie": 3,
  "72KashirEquipmentsCountPie": 3,
  totalEquipmentsCountPie: 3,
  rnKashirEquipmentsCountPie: 2,
};

export const demoTopViewDynamicFilters = {
  routineGdudFilters: [
    { fieldname: "routineGdud", key: "50000101", value: "גדוד 71" },
    { fieldname: "routineGdud", key: "50000102", value: "גדוד 72" },
  ],
  warGdudFilters: [
    { fieldname: "warGdud", key: "60000101", value: "גדוד 71 חירום" },
    { fieldname: "warGdud", key: "60000102", value: "גדוד 72 חירום" },
  ],
};

// ---- Fault Data ----
export const demoFaultData = {
  faultNum: "1001",
  equipment: "12345",
  faultStatus: "02",
  essence: "תקלה במערכת הנעה",
  expectedTime: "03",
  grindType: "01",
  availabilityInhibitor: "02",
  contact: "ישראל ישראלי",
  phoneNumber: "050-1234567",
  mobileAbility: "01",
  note: "הערה לדוגמה",
  dereg: "01",
  squad: "צוות 1",
  reqSquad: "01",
  phisicalLocation: "01",
  phisicalLocationDesc: "בסיס 1",
  transportationType: "",
  createTimestamp: new Date("2026-01-15"),
  changeTimestamp: new Date("2026-02-20"),
  comments: [
    {
      faultNum: "1001",
      commentNum: 1,
      commentText: "תקלה זוהתה",
      creationTimestamp: new Date("2026-01-15"),
      username: "demo_user",
      fullName: "משתמש דמו",
    },
  ],
  hhs: [],
  means: [],
};

// ---- Tags ----
export const demoTags = [
  { id: "01", text: "תג 1", inEquipment: true },
  { id: "02", text: "תג 2", inEquipment: false },
];

export const demoTagOptions = [
  { value: "01", text: "תג 1" },
  { value: "02", text: "תג 2" },
  { value: "03", text: "תג 3" },
];

// ---- Logs ----
export const demoLogs = [
  {
    logType: "01",
    logTypeKey: "12345",
    field: "KSHIRUT",
    changeTimestamp: new Date("2026-02-20"),
    watchedUser: "demo_user",
    newValue: "01",
    zadikNumber: "12345",
  },
];

// ---- Summary Faults ----
export const demoSummaryFaults = [
  {
    changeTimestamp: new Date("2026-02-20"),
    faultNum: "1001",
    faultStatus: "02",
    essence: "תקלה במערכת הנעה",
    equipment: "12345",
    isValid: true,
  },
  {
    changeTimestamp: new Date("2026-02-19"),
    faultNum: "1002",
    faultStatus: "01",
    essence: "תקלה במערכת חשמל",
    equipment: "12346",
    isValid: true,
  },
];

// ---- Screen Creators ----
export const demoScreenCreators = [
  { creatorId: "demo_user", creatorName: "משתמש דמו" },
];

// ---- Shared Screens ----
export const demoSharedScreens = [
  {
    id: "SCR02",
    name: "מסך טנקים",
    categoryId: "CAT02",
    categoryName: "שריון",
    color: "#388e3c",
    creator: "demo_user",
    creatorName: "משתמש דמו",
    isShared: true,
  },
];
