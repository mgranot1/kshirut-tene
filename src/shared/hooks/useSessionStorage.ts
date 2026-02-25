const useSessionStorage = <T = unknown>(
  key: string
): [T | undefined, (value: T | undefined) => void, () => void] => {
  const getValueFromSessionStorage = (): T => {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  };

  const valueFromSessionStorage: string | null = sessionStorage.getItem(key);

  const convertedValue =
    valueFromSessionStorage === null ||
    valueFromSessionStorage === "undefined" ||
    valueFromSessionStorage === "null"
      ? undefined
      : JSON.parse(valueFromSessionStorage);

  const setValueInSessionStorage = (value: T | undefined): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const removeFromStorage = (): void => {
    sessionStorage.removeItem(key);
  };

  return [convertedValue, setValueInSessionStorage, removeFromStorage];
};

export default useSessionStorage;
