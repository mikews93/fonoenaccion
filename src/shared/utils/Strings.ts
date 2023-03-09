import { RuleObject } from 'antd/es/form';
import { v4 as uuidv4 } from 'uuid';
import { getRndInteger } from './Numbers';

/**
 * only returns alphanumeric characters
 * @param {string} text
 * @returns string
 */
export const removeSpecialChars = (text = '') => {
  return text.replace(/[^a-zA-Z0-9]/g, ' ');
};

/**
 * generates a random string
 * @returns string
 */
export const generateSlug = () => {
  return uuidv4().replace(/-/g, '');
};

/**
 * Generate a string with specified mask characters
 * @param mask {string} defaults *
 * @param length {number} define the number of characters to return
 * @returns {string} with random mask character
 */
export const maskPasswordGenerator = (length?: number, mask: string = '*'): string => {
  let min, max;
  if (length) {
    min = length;
    max = length;
  } else {
    min = 5;
    max = 15;
  }

  return new Array(getRndInteger(min, max)).fill(mask).join('');
};

/**
 * Generates id for components
 * @param length {number} defaults to 5 if undefined
 * @returns alphanumeric string of length specified
 */
export const makeId = (length: number = 5): string => {
  let result = '';
  const characters = `${generateAlphabet(true)}${generateAlphabet()}${generateStringNumber()}`;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Generates alphabet
 * @param uppercase {boolean} whether to return alphabet as uppercase
 * @returns {string}
 */
export const generateAlphabet = (uppercase = false) => {
  const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)).join('');
  return uppercase ? alphabet.toUpperCase() : alphabet;
};

/**
 * Generates string of numbers until specified length
 * @param length {number} defaults to 10 if undefined
 * @returns string of numbers
 */
export const generateStringNumber = (length: number = 10) => {
  return Array(length)
    .map((_, index) => index)
    .join('');
};

/**
 * Validator for not empty text
 * @param rule {RuleObject}
 * @param value {string}
 * @returns {Promise}
 */
export const notEmptyTextValidator = (_: RuleObject, value: string) =>
  value != '' && !value?.trim()
    ? Promise.reject(new Error('Empty text is not allowed'))
    : Promise.resolve();

/**
 * Return file properties from fileName
 * @param fileName {string}
 */
export const getFileProps = (fileName: string = ''): string[] => {
  const index = fileName.lastIndexOf('.');
  const extension = fileName.substring(index);
  return [fileName.slice(0, index), extension];
};

/**
 * Useful to remove spaces and prevent possible visual duplicates names
 * @param name {string} to normalize
 * @returns string without spaces and the beginning and the end, and just
 * one space among words
 */
export const normalizeName = (name: string = ''): string => {
  return name.replace(/\s\s+/g, ' ').trim();
};

/**
 * Useful to remove leading or trailing empty spaces
 * @param name {string} to normalize
 * @returns string without leading or trailing empty spaces
 */
export const normalizeLeadingOrTrailingSpaces = (name: string = ''): string => {
  return name.replace(/^\s+|\s+$/g, '');
};

/**
 * Validator for leading or trailing empty spaces in string
 * @param rule {RuleObject}
 * @param value {string}
 * @returns {Promise}
 */
export const leadingOrTrailingSpacesValidator = (_: RuleObject, value: string) => {
  return value === '' || /^\w+(\s*\w+)*$/.test(value)
    ? Promise.resolve()
    : Promise.reject(new Error('Leading or trailing white spaces are not allowed'));
};
