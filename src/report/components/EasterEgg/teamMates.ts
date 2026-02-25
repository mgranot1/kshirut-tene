export type TeamMate = {
  name: string;
  personalNumber: string;
  dead?: boolean;
};

export const teamMates: TeamMate[] = [
  { name: "יהונתן טל", personalNumber: "S9017708" },
  { name: "אורי פלג", personalNumber: "S9033451" },
  { name: "לודמילה צ'וחראי", personalNumber: "s8835352" },
  { name: "דניאל ניסן", personalNumber: "s9003986" },
  { name: "יעל נאמן", personalNumber: "c9808945", dead: true },
  { name: "מיכל גרנות", personalNumber: "c9810604" },
  { name: "שחר עפרון", personalNumber: "s8821096", dead: true },
  { name: "נועם צבי", personalNumber: "s8745726", dead: true },
  { name: "מאי מססה", personalNumber: "s9033491" },
];
