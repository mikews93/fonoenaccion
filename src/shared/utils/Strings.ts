import { v4 as uuidv4 } from 'uuid';

/**
 * generates a random string
 * @returns string
 */
 export const generateSlug = () => {
  return uuidv4().replace(/-/g, '');
};