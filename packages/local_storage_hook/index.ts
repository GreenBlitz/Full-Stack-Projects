// בס"ד
import { useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (val: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    const item = window.localStorage.getItem(key);
    const parsedItem = item ? (JSON.parse(item) as T) : initialValue;
    localStorage.setItem(key, JSON.stringify(parsedItem));
    return parsedItem;
  });

  //   useEffect(() => {
  //     try {
  //       if (typeof window === "undefined") {
  //         return;
  //       }
  //       const item = window.localStorage.getItem(key);
  //       if (item === null) {
  //         const defaultValue = initialValueRef.current;
  //         setStoredValue(defaultValue);
  //         window.localStorage.setItem(key, JSON.stringify(defaultValue));
  //       } else {
  //         const parsed = JSON.parse(item) as T;
  //         setStoredValue(parsed);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       const defaultValue = initialValueRef.current;
  //       setStoredValue(defaultValue);
  //       if (typeof window !== "undefined") {
  //         window.localStorage.setItem(key, JSON.stringify(defaultValue));
  //       }
  //     }
  //   }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};

export { useLocalStorage };
