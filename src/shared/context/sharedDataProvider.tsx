import { ReactNode, useState } from 'react';

// @context
import { SharedDataContext, SharedDataType } from './sharedDataContext';

// @contextProvider
import { ThemeProvider } from './themeProvider';

// @constants
import { SHARED_DATA_INITIAL_STATE } from './constants';

// @hooks
import { useScreen } from 'shared/hooks/useScreen';

// @utils

interface SharedDataProviderProps {
	children: ReactNode;
}

export const SharedDataProvider = ({ children }: SharedDataProviderProps) => {
	/**
	 * Hooks
	 */
	const { isMobile } = useScreen();

	/**
	 * State
	 */
	const [sharedData, setSharedData] = useState<SharedDataType>(SHARED_DATA_INITIAL_STATE);

	return (
		<SharedDataContext.Provider value={{ ...sharedData, setSharedData, isMobileView: isMobile }}>
			<ThemeProvider>{children}</ThemeProvider>
		</SharedDataContext.Provider>
	);
};
