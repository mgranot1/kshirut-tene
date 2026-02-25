export const isNotEmptyArray = (array?: Array<unknown>) =>
  Array.isArray(array) && array.length > 0;

export const isNotEmptyObject = (obj?: Object) =>
  obj && typeof obj === "object" && Object.keys(obj).length > 0;

export const isStringANumber = (val: string) => {
  const reg = new RegExp("^[0-9]*$");
  return reg.test(val);
};

export function uniqBy<T>(array: T[], key: (item: T) => PropertyKey): T[] {
  var seen: Record<PropertyKey, boolean> = {};
  return array.filter((item) => {
    let keyCallback: PropertyKey = key(item);
    return seen.hasOwnProperty(keyCallback)
      ? false
      : (seen[keyCallback] = true);
  });
}

export const convertBooleanToSAP = (bool: boolean) => {
  return bool ? "X" : " ";
};

export const convertSAPToBoolean = (bool: "X" | "") => {
  return bool === "X";
};

export const truncate_text = (text: string, maxLength: number = 20) => {
  return text.length > maxLength
    ? `${text.substring(0, maxLength - 1)}…`
    : text;
};
export const padTo8Digits = (value: number | string): string => {
  const num = Number(value).toString();
  return num.padStart(8, "0");
};

