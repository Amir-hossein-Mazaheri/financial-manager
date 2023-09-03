import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  preProcess?: (value: T) => T
) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue) {
      const parseValue = JSON.parse(storedValue);

      if (preProcess) {
        return setValue(preProcess(parseValue));
      }

      setValue(parseValue);
    }
  }, [key, preProcess]);

  const handleStoreValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, handleStoreValue] as const;
}
