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
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsedItem = JSON.parse(item) as T;
      return parsedItem;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prevState: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};

export { useLocalStorage };
