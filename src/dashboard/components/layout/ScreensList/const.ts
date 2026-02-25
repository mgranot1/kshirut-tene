export enum ScreenAccessType {
  MyScreen = "my",
  Shared = "shared",
}

export const listTitle: Record<string, string> = {
  [ScreenAccessType.MyScreen]: "מסכים שיצרתי",
  [ScreenAccessType.Shared]: "מסכים משותפים",
};

export const emptyListMessage: Record<string, string> = {
  [ScreenAccessType.MyScreen]: "טרם יצרת מסך",
  [ScreenAccessType.Shared]: "טרם שיתפת מסך",
};