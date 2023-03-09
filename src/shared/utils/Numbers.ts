/**
 * Returns random number within range
 * @param min number
 * @param max number
 * @returns randomNumber
 */
export const getRndInteger = (min = 0, max = 10) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
