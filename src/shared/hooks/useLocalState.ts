import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from 'shared/utils/LocalStorage';

export const useLocalState = <T>(
  defaultValue: T,
  key: string = ''
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = getLocalStorage(key);
      return isEmpty(stickyValue) ? defaultValue : stickyValue;
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });
  useEffect(() => {
    setLocalStorage({ key, value: value });
  }, [key, value]);
  return [value, setValue];
};
