export enum ROUTES {
	PUBLIC = '/*',
	HOME = '/app/',
	LOGIN = '/authenticate',
	LOGOUT = '/logout',
	REGISTER = '/register',
	FORGOT_PASSWORD = '/forgot-password',
	NOT_FOUND = '*',
}

export enum PUBLIC_ROUTES {
	START = '/',
	SHOP = '/shop',
	BLOG = '/blog',
}

/**
 * ROUTES TO CONTAINER:
 * Routes below will become components under containers folder
 * The key will be taken as the folder and file name for the component
 * If there the key contains an underscore it will be removed
 *
 * for instance
 * route SPIELS will become Spiels/Spiels.tsx
 * route SPIEL_DETAIL will become SpielDetail/SpielDetail.tsx
 *
 * Checkout 'getLazyContainer' on Home component
 */
export enum APP_ROUTES {
	SPIELS = 'spiels',
	SPIEL_DETAILS = 'spiels/:id',
	NEW_SPIEL = 'spiels/new-spiel',
	PERSONAS = 'personas',
	PERSONA_DETAILS = 'personas/:id',
	NEW_PERSONA = 'personas/new-persona',
	ASSETS = 'uploads',
	VIDEOS = 'videos',
	PLAYLISTS = 'playlists',
}

export enum PROJECT_ROUTES {
	PROJECTS = 'projects',
	SETTINGS = 'settings',
	ENVIRONMENTS = 'environments',
}

export enum ORGANIZATIONAL_ROUTES {
	REPLACEMENTS = 'replacements',
	// GROUPS = 'groups',
}

export enum USER_ROUTES {
	PROFILE = 'profile',
}

export const HOME_ROUTES = {
	...APP_ROUTES,
	...PROJECT_ROUTES,
	...USER_ROUTES,
	...ORGANIZATIONAL_ROUTES,
};
