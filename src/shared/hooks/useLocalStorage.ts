const useLocalStorage = <T = unknown>(
  key: string
): [T | null, (value: T) => void] => {
  const getValueFromLocalStorage = (): T => {
    return JSON.parse(localStorage.getItem(key) || "null");
  };

  const valueJSON = localStorage.getItem(key);

  const valueFromLocalStorage: T | null = valueJSON
    ? JSON.parse(valueJSON)
    : null;

  const setValueInLocalStorage = (value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [valueFromLocalStorage, setValueInLocalStorage];
};

export default useLocalStorage;
