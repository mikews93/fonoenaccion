// @vendors
import { createContext, Dispatch, SetStateAction } from 'react';
import { SHARED_DATA_INITIAL_STATE } from './constants';

// @constants

// @types
import { Theme } from 'shared/types/theme';

export interface SharedDataType {
	theme?: Partial<Theme>;
	isMobileView?: boolean;
}

export interface SharedDataContextType extends SharedDataType {
	setSharedData: Dispatch<SetStateAction<SharedDataType>>;
}

const initialState: SharedDataContextType = {
	setSharedData: () => {},
	...SHARED_DATA_INITIAL_STATE,
};

// @context
export const SharedDataContext = createContext(initialState);
