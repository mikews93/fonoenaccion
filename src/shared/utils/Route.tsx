import { matchRoutes, RouteObject, useLocation } from 'react-router-dom';

/**
 * Gets the current path on location
 * @param routes RouteObject[]
 * @returns string
 */
export const useCurrentPath = (routes: RouteObject[]) => {
  const location = useLocation();

  const getPath = () => {
    const match = matchRoutes(routes, location);

    return match ? match[0].route.path : '';
  };

  return getPath;
};
