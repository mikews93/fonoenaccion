import { SELECTED_THEME } from 'shared/constants';
import { THEMES } from 'shared/types/theme';

// @context
import { SharedDataType } from './sharedDataContext';

// @utils
import { getLocalStorage } from 'shared/utils/LocalStorage';

/**
 * Initiates the shared data state to avoid null validations
 */
export const SHARED_DATA_INITIAL_STATE: SharedDataType = {
	theme: {
		name: getLocalStorage(SELECTED_THEME) || THEMES.LIGHT,
	},
	isMobileView: false,
};
