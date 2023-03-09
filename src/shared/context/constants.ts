import { isEmpty, toLower } from 'lodash';
import {
	AUTH_PROFILE,
	SELECTED_CLIENT,
	SELECTED_PROJECT,
	SELECTED_THEME,
	SIDEBAR_STATE,
	SWITCH_COOKIE,
} from 'shared/constants';
import { THEMES } from 'shared/types/theme';

// @context
import { SharedDataType } from './sharedDataContext';

// @utils
import { getSessionStorage } from 'shared/utils/SessionStorage';
import { getLocalStorage } from 'shared/utils/LocalStorage';
import { Cookies } from 'react-cookie';

const {
	VITE_API_URL,
	VITE_CLASSIC_CONSOLE_URL,
	VITE_DOWNLOAD_PLAYLIST_URL,
	VITE_LAUNCH_DARKLY_ID,
	VITE_LEGACY_API_URL,
	VITE_PREVIEWER_URL,
	VITE_SOCKET_ENABLED,
	VITE_SOCKET_URL,
	VITE_VIDEATE_VIDEO,
	VITE_WATCH_PLAYLIST_URL,
	VITE_SWITCH_COOKIE_DOMAIN,
	VITE_MAPS_API_KEY,
} = import.meta.env;

const userInfo = getLocalStorage(AUTH_PROFILE) || new Cookies().get(SWITCH_COOKIE)?.useInfo;

/**
 * Initiates the shared data state to avoid null validations
 */
export const SHARED_DATA_INITIAL_STATE: SharedDataType = {
	theme: {
		name: getLocalStorage(SELECTED_THEME) || THEMES.LIGHT,
	},
	settings: {
		apiUrl: VITE_API_URL,
		downloadPlaylistUrl: VITE_DOWNLOAD_PLAYLIST_URL,
		enableSocket: toLower(VITE_SOCKET_ENABLED) === 'true',
		launchDarklyId: VITE_LAUNCH_DARKLY_ID,
		legacyApiUrl: VITE_LEGACY_API_URL,
		previewerUrl: VITE_PREVIEWER_URL,
		socketUrl: VITE_SOCKET_URL,
		videateVideoUrl: VITE_VIDEATE_VIDEO,
		watchPlaylistUrl: VITE_WATCH_PLAYLIST_URL,
		classicConsoleUrl: VITE_CLASSIC_CONSOLE_URL,
		switchCookieDomain: VITE_SWITCH_COOKIE_DOMAIN,
		mapsApiKey: VITE_MAPS_API_KEY,
	},
	clientSettings: userInfo?.clientConfig || {},
	user: {
		info: userInfo,
		isFetching: false,
		isAuthenticated: !isEmpty(userInfo),
	},
	selectedClient: getSessionStorage(SELECTED_CLIENT) || 0,
	selectedProject: getSessionStorage(SELECTED_PROJECT),
	isMobileView: false,
	isSidebarCollapsed: !!getLocalStorage(SIDEBAR_STATE)?.collapsed,
};
