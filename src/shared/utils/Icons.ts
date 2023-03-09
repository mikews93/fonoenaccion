/**
 * @param countryCode String
 * @returns emoji flag for countryCode
 */

export const getCountryFlag = (countryCode: string) => {
  return (
    countryCode
      ?.toUpperCase()
      /* @ts-ignore */
      ?.replace(/./g, (char: string) => String.fromCodePoint(127397 + char.charCodeAt()))
  );
};
