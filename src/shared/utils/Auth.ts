import decodeJWT from 'jwt-decode';
import moment from 'moment';
import { Cookies } from 'react-cookie';
import { requestNewAccessToken } from 'shared/api/api';

// @constants
import { AUTH_PROFILE, AUTH_REFRESH, SELECTED_CLIENT, SWITCH_COOKIE } from 'shared/constants';
import { SharedDataContextType } from 'shared/context/sharedDataContext';
import { ROUTES } from 'shared/routes';

// @types
import { UserType } from 'shared/types/userType';

// @utils
import {
	getLocalStorage,
	deleteLocalStorageKeys,
	setLocalStorage,
} from 'shared/utils/LocalStorage';
import { log } from './Log';
import { setSessionStorage } from './SessionStorage';

const { VITE_CLASSIC_CONSOLE_URL: classicConsoleUrl, VITE_SWITCH_COOKIE_DOMAIN: cookieDomain } =
	import.meta.env;

const JWT_RETRY_ATTEMPTS = 3;

/**
 * converts the user info from old console to current one
 * @param {UserInfo V3} userInfo classic userInfo from old console
 * @returns {UserType}
 */
const getUserInfoFromClassic = ({
	id,
	userId: userID,
	fullName,
	token,
	refreshToken,
	email,
	sessions,
	avatarUrl,
	isWistiaUser,
	activeClientId,
}: any): UserType => ({
	id,
	userID,
	fullName,
	token,
	refreshToken,
	email,
	sessions,
	avatarUrl,
	name: fullName,
	// TODO: review this roles
	roles: ['VideateAdmin'],
	clientID: activeClientId,
	clientConfig: {
		hasWistiaConfig: isWistiaUser,
	},
});

/**
 *
 * @param userInfo {UserType}
 */
const exportUserInfoToClassic = ({
	id,
	userID,
	fullName,
	token,
	refreshToken,
	email,
	sessions,
	avatarUrl,
	clientConfig,
}: UserType) => ({
	id,
	userId: userID,
	fullName,
	token,
	refreshToken,
	email,
	sessions,
	avatarUrl,
	isWistiaUser: !!clientConfig?.hasWistiaConfig,
});

/**
 * Check if there is a user logged in
 * @returns string
 */
export const isUserAuthenticated = () => {
	const userInfo = getLocalStorage(AUTH_PROFILE);

	return isValidJWT(userInfo?.token || '', { verifyExpireTime: false });
};

export const removeLSAuth = () => deleteLocalStorageKeys([AUTH_PROFILE, AUTH_REFRESH]);

/**
 * removes user from local storage
 */
export const logout = (redirectTo?: string) => {
	removeLSAuth();
	return window.location.replace(redirectTo || ROUTES.LOGIN);
};

export const createSwitchCookie = (userInfo: UserType, domain: string = cookieDomain) => {
	const switchCookie = new Cookies();
	const { exp } = decodeJWT<{ exp: number }>(userInfo.token);
	const expires = moment.unix(exp).toDate();
	switchCookie.set(SWITCH_COOKIE, JSON.stringify({ userInfo: exportUserInfoToClassic(userInfo) }), {
		path: '/',
		httpOnly: false,
		domain,
		expires,
	});
};

/**
 * Put user info into localStorage and context
 * @param data UserType
 */
export const setUserInApplication = (
	{ token, clientConfig, clientID, refreshToken, ...otherInfo }: UserType,
	updateContext?: SharedDataContextType['setSharedData']
) => {
	const userInfo: UserType = {
		...otherInfo,
		...(decodeJWT(token) || {}),
		token,
	};
	updateContext?.((sharedData) => {
		setLocalStorage({
			key: AUTH_PROFILE,
			value: userInfo,
		});
		if (refreshToken) {
			setLocalStorage({ key: AUTH_REFRESH, value: { refreshToken } });
		}

		// TODO: OLD UI FIX: remove this after stop using old console
		createSwitchCookie(userInfo);
		// * clientID will come from classicUI this condition is here to preserve
		// * the client id selected on classicUI when the user switch to the new UI
		if (clientID) {
			sharedData.selectedClient = clientID;
			setSessionStorage({ key: SELECTED_CLIENT, value: clientID });
		}
		//TODO: remove until here...

		return {
			...sharedData,
			user: { ...sharedData.user, info: userInfo, isAuthenticated: true },
			clientSettings: {
				...(userInfo?.clientConfig || {}),
			},
		};
	});
};

/**
 * obtains the refresh token
 * @returns string
 */
export const getRefreshToken = () => {
	const { refreshToken } = getLocalStorage(AUTH_REFRESH);
	return refreshToken;
};

/**
 * obtains the access token
 * @returns string
 */
export const getAccessToken = () => {
	const { token } = getLocalStorage(AUTH_PROFILE);
	return token;
};

/**
 * Checks if whether a JWT token is expired or not
 * @param {string} token JWT formatted token
 * @returns {Boolean}
 */
const nonExpiredToken = (token = '') => {
	try {
		const { exp } = decodeJWT<{ exp: number }>(token);
		const expDate = moment.unix(exp);
		const currentTime = moment.unix(moment().unix());
		return expDate.isAfter(currentTime);
	} catch (error) {
		return false;
	}
};

/**
 * Determines if a JWT token is valid
 * @param {string} token JWT formatted string
 * @param {object} options where to check expiration time or not
 * @returns {boolean} true if token is invalid an
 */
export const isValidJWT: (token: string, options?: { verifyExpireTime: boolean }) => boolean = (
	token = '',
	options
) => {
	const { verifyExpireTime = true } = options || {};
	const isWellFormedToken = token.split('.').length === 3;
	const isNonExpiredToken = verifyExpireTime ? nonExpiredToken(token) : true;
	/**
	 * leave room for other checks
	 */
	return isNonExpiredToken && isWellFormedToken;
};

/**
 * Sets time out to refresh token
 * @param {function} updateState function to update users info
 */
export const revalidateUserInfo = async (updateContext: SharedDataContextType['setSharedData']) => {
	const token = getAccessToken();
	const { exp } = decodeJWT<{ exp: number }>(token);
	const expDate = moment.unix(exp);
	const currentTime = moment();
	const timeToExpire = moment.duration(expDate.diff(currentTime)).asMilliseconds();

	// * grace period will be the 10% time left for the token to expire
	const gracePeriod = timeToExpire * 0.1;
	const timeoutExecutionAt = timeToExpire - gracePeriod;

	const refreshAccessToken = async (attempts = JWT_RETRY_ATTEMPTS) => {
		const refreshToken = getRefreshToken();
		if (!isUserAuthenticated() || !isValidJWT(refreshToken)) {
			return;
		}
		log.debug(`refreshing token, attempts left ${attempts}`);
		try {
			const { data } = await requestNewAccessToken(refreshToken);
			setUserInApplication(data, updateContext);
			log.debug('token refreshed');
		} catch (error) {
			log.error(error);
			if (attempts) {
				setTimeout(() => {
					refreshAccessToken(--attempts);
				}, 10000);
			}
		}
	};

	const immediateExecution = timeToExpire < gracePeriod;
	if (immediateExecution) {
		return setTimeout(refreshAccessToken);
	}

	log.debug(
		`next token refresh is ${moment().to(moment().add(timeoutExecutionAt, 'milliseconds'))}`
	);
	return setTimeout(() => refreshAccessToken(), timeoutExecutionAt);
};
