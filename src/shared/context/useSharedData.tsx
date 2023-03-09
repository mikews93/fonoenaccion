// @vendors
import { useContext, useMemo } from 'react';

// @context
import { SharedDataContext, SharedDataContextType, SharedDataType } from './sharedDataContext';

export const useSharedDataContext = (): [
  SharedDataType,
  SharedDataContextType['setSharedData']
] => {
  const { setSharedData, ...sharedData } = useContext(SharedDataContext);
  return [useMemo(() => sharedData, [sharedData]), setSharedData];
};
