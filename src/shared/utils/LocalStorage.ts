import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

/**
 * returns the value of a key in the local storage
 * @param key {string} name of key on local storage
 * @returns {object} value of key
 */
export const getLocalStorage = (key: string) => {
  const content = localStorage.getItem(key);
  if (!content) {
    return '';
  }
  return JSON.parse(content);
};

/**
 * Sets items to local storage
 * @param {Object} arguments { [string]key, [string] value, [string] key, [boolean] stringify }
 */
export const setLocalStorage = ({ key, value, stringify = true }: { key: string, value: any, stringify?: boolean }) => {
  localStorage.setItem(key, stringify ? JSON.stringify(value) : value);
};

/**
 * removes a key from local storage
 * @param {string | array} keys key to delete on local storage
 */
export const deleteLocalStorageKeys = (keys: string | string[] = []): void => {
  if (isString(keys)) {
    keys = [keys];
  }

  if (isArray(keys)) {
    keys.map((key) => localStorage.removeItem(key));
  }
};
