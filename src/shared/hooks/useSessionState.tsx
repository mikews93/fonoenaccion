import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { getSessionStorage, setSessionStorage } from 'shared/utils/SessionStorage';
import { log } from 'shared/utils/Log';

/**
 * Keeps track of values on session storage
 * @param defaultValue value to return in case of null
 * @param key lookup field
 * @returns value and function to set the value
 */
export const useSessionState = <T,>(
  key: string,
  defaultValue?: T
): [value: T, setValue: Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = getSessionStorage(key);
      return !isEmpty(stickyValue) ? stickyValue : defaultValue || {};
    } catch (error) {
      log.error(error);
      return defaultValue;
    }
  });
  useEffect(() => {
    setSessionStorage({ key, value });
  }, [key, value]);
  return [value, setValue];
};
