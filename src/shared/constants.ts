const { VITE_SWITCH_COOKIE_DOMAIN: cookieDomain } = import.meta.env;

// ----------------------------- LOCAL STORAGE -----------------------------
export const AUTH_PROFILE = 'auth_profile';
export const AUTH_REFRESH = 'auth_refresh';
export const SELECTED_THEME = 'selectedTheme';

// ------------------------- REQUEST STATUS -----------------------
export const REQUEST_STATUS_CODES = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};

// ----------------------------- SESSION -----------------------------
export const SELECTED_CLIENT = 'selectedClient';
export const SELECTED_PROJECT = 'selectedProject';
export const SIDEBAR_STATE = 'sidebarState';

// -------------------------- FORMATS --------------------------------
export const DATE_FORMAT = 'YYYY-MM-DD LT';

export const DEBOUNCE_TIME = 500;

// -------------------------- COOKIES ----------------------------
export const SWITCH_COOKIE = `vd8-switch-cookie-${cookieDomain}`;

export enum PARTIAL_SERVICES {
	general = 'general',
	// swallowing = 'swallowing',
	// learning = 'learning',
	speech_therapy = 'speech_therapy',
	// hearing = 'hearing',
	language = 'language',
}
