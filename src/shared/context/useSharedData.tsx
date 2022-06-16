// @vendors
import { useContext, useMemo } from 'react';

// @context
import { SharedDataContext } from './sharedDataContext';

export const useSharedDataContext = () => {
  const sharedData = useContext(SharedDataContext);
  return useMemo(() => sharedData, [sharedData]);
};
