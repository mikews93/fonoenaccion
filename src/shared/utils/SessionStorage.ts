import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

/**
 * returns the value of a key in the session storage
 * @param key {string} name of key on session storage
 * @returns {object} value of key
 */
export const getSessionStorage = (key: string) => {
  const content = sessionStorage.getItem(key);
  if (!content) {
    return '';
  }
  return JSON.parse(content);
};

/**
 * Sets items to session storage
 * @param {Object} arguments { [string]key, [string] value, [string] key, [boolean] stringify }
 */
export const setSessionStorage = ({
  key,
  value,
  stringify = true,
}: {
  key: string;
  value: any;
  stringify?: boolean;
}) => {
  sessionStorage.setItem(key, stringify ? JSON.stringify(value) : value);
};

/**
 * removes a key from session storage
 * @param {string | array} keys key to delete on session storage
 */
export const deleteSessionStorageKeys = (keys: string | string[] = []): void => {
  if (isString(keys)) {
    keys = [keys];
  }

  if (isArray(keys)) {
    keys.map((key) => sessionStorage.removeItem(key));
  }
};
