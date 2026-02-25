export enum HierLevel {
  All = "0",
  Family = "1",
  Platform = "2",
  SubPlatform = "3",
  Material="4"
}
export interface IFamily {
  code: string;
  description: string;
  hierLevel: HierLevel;
  parentCode: string;
}
