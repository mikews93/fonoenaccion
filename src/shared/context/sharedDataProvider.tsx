// @vendors
import { ReactNode, useState } from 'react';

// @context
import { SharedDataContext, SharedDataType } from './sharedDataContext';

// @constants
import { SHARED_DATA_INITIAL_STATE } from './constants';

// @types
interface SharedDataProviderProps {
	children: ReactNode;
}

export const SharedDataProvider = ({ children }: SharedDataProviderProps) => {
	/**
	 * State
	 */
	const [sharedData, setSharedData] = useState<SharedDataType>(SHARED_DATA_INITIAL_STATE);

	return (
		<SharedDataContext.Provider value={{ ...sharedData, setSharedData }}>
			{children}
		</SharedDataContext.Provider>
	);
};
