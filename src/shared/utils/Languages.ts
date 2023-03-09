import { LanguagePretty } from 'shared/types/languages';

/**
 * @description This function checks if only one language exists
 * @param LanguagePretty[] {languages} the languages array
 * @returns boolean
 */
export const hasOneLanguage = (languages: LanguagePretty[]): boolean => {
  return languages.length === 1 && languages[0].options.length === 1;
};

/**
 * @description This function return first language
 * @param LanguagePretty[] {languages} the languages array
 * @returns string
 */
export const getFirstLanguage = (languages: LanguagePretty[]): string => {
  return languages.length ? languages[0].options[0]?.value : '';
};
