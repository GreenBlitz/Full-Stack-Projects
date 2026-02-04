// בס"ד
import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (val: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      console.warn(
        "useLocalStorage called during SSR, falling back to initialValue",
      );
      return initialValue;
    }
    const item = window.localStorage.getItem(key);
    let parsedItem = initialValue;
    if (item) {
      try {
        parsedItem = JSON.parse(item) as T;
      } catch (error) {
        console.warn(
          `useLocalStorage failed to parse key "${key}", resetting to initialValue`,
          error,
        );
      }
    }
    try {
      localStorage.setItem(key, JSON.stringify(parsedItem));
    } catch (error) {
      console.warn(
        `useLocalStorage failed to persist key "${key}" during init`,
        error,
      );
    }
    return parsedItem;
  });

  const setValue = (value: T | ((prevState: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(
          `useLocalStorage failed to persist key "${key}"`,
          error,
        );
      }
    }
  };

  return [storedValue, setValue];
};

export { useLocalStorage };
