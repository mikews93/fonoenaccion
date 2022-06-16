// @vendors
import { useCallback, useState } from 'react';
import { AUTH_PROFILE } from 'shared/constants';
import { SharedDataContextType } from 'shared/context/sharedDataContext';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { setLocalStorage } from 'shared/utils/LocalStorage';

// @api
// import VideateApi from 'libs/apiWrapper';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomlyFail = () => {
	const result = Math.random() < 0.5;
	if (!result) {
		throw new Error('Error randomly failing');
	}
	return result;
};

type UseLoginReturnType = [
	login: ({
		username,
		password,
		rememberMe,
	}: {
		username: string;
		password: string;
		rememberMe: boolean;
	}) => Promise<
		| {
				data: {
					username: string;
					password: string;
					rememberMe: boolean;
					name: string;
					token: string;
				};
				error?: undefined;
		  }
		| {
				error: unknown;
				data?: undefined;
		  }
	>,
	options: { isLoginIn: boolean }
];

export const useLogin = (): UseLoginReturnType => {
	/**
	 * Context
	 */
	// @ts-ignore
	const { setSharedData } = useSharedDataContext();

	/**
	 * State
	 */
	const [isLoginIn, setIsLoginIn] = useState(false);

	/**
	 * Callbacks
	 */
	const login = useCallback(
		async ({
			username,
			password,
			rememberMe,
		}: {
			username: string;
			password: string;
			rememberMe: boolean;
		}) => {
			try {
				randomlyFail();
				setSharedData((prevData: SharedDataContextType) => ({
					...prevData,
					user: {
						...prevData.user,
						isFetching: true,
						isAuthenticated: false,
					},
				}));
				setIsLoginIn(true);
				await delay(3000);
				const data = {
					username,
					password,
					rememberMe,
					name: 'Miguel Blanco',
					token:
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTUwNTU0NzksInVzZXJJRCI6MTUxfQ.E3-CZZNGs_0luagoarhIovbX9AyazLA06fmKcVdfEgs',
				};
				setSharedData((prevData: SharedDataContextType) => ({
					...prevData,
					user: {
						info: {
							...data,
						},
						isFetching: false,
						isAuthenticated: true,
					},
				}));
				setLocalStorage({ key: AUTH_PROFILE, value: data });
				return { data };
			} catch (error) {
				return { error };
			} finally {
				setIsLoginIn(false);
			}
		},
		[delay, randomlyFail, setSharedData]
	);

	return [login, { isLoginIn }];
};
