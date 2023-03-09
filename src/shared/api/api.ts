import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import decodeJWT from 'jwt-decode';
import moment from 'moment';

// @constants
import { AUTH_PROFILE, REQUEST_STATUS_CODES } from 'shared/constants';

// @types
import { SharedDataContextType } from 'shared/context/sharedDataContext';
import { UserType } from 'shared/types/userType';

// @routes
import { ROUTES } from 'shared/routes';

// @utils
import {
  getRefreshToken,
  isUserAuthenticated,
  isValidJWT,
  logout,
  setUserInApplication,
} from 'shared/utils/Auth';
import { getLocalStorage } from 'shared/utils/LocalStorage';
import { log } from 'shared/utils/Log';

export type RequestObject = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: any;
  timeout?: number;
  params?: any;
  useLegacyApi?: boolean;
  setContext?: SharedDataContextType['setSharedData'];
  responseType?: AxiosRequestConfig['responseType'];
};

const { VITE_API_URL, VITE_LEGACY_API_URL } = import.meta.env;

const getToken = () => {
  const { token } = getLocalStorage(AUTH_PROFILE);
  return token;
};

const createHeaders = (isfileUpload = false) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': !isfileUpload ? 'application/json' : 'multipart/form-data',
    Authorization: '',
  };
  const token = getToken();
  if (token && token.length >= 30) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
};

export const fetchCall = ({ method, url, data, headers, useLegacyApi }: RequestObject) => {
  const baseURL = new String(useLegacyApi ? VITE_LEGACY_API_URL : VITE_API_URL);
  return fetch(baseURL.concat(url), {
    method: method?.toLowerCase(),
    headers: { ...createHeaders(), ...headers },
    body: JSON.stringify(data),
  });
};

export const requestCall = ({
  method = 'GET',
  url,
  data,
  headers,
  timeout,
  params,
  useLegacyApi,
  setContext,
  responseType,
}: RequestObject) => {
  axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Handle response errors
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      switch (error.response?.status) {
        case REQUEST_STATUS_CODES.UNAUTHORIZED:
          return await handleUnauthorizedResponse(error, setContext);
        case REQUEST_STATUS_CODES.NOT_FOUND:
          return window.location.replace(`/${ROUTES.NOT_FOUND}`);
        default:
          return Promise.reject(error);
      }
    }
  );

  return axios({
    url,
    method: method.toLowerCase(),
    headers: { ...createHeaders(), ...headers },
    baseURL: useLegacyApi ? VITE_LEGACY_API_URL : VITE_API_URL,
    timeout: timeout || 20000,
    data,
    params,
    responseType,
  });
};

export const getFetcher =
  ({ ...options }: Omit<RequestObject, 'url'> = {}) =>
  (url: string) => {
    // ? leave room to configure other fetchers
    return requestCall({ url, ...options }).then((res: any) => res.data || res);
  };

export const SWR_CONFIG = {
  suspense: true,
};

const handleUnauthorizedResponse = async (
  error: AxiosError,
  setContext?: RequestObject['setContext']
) => {
  const originalRequest = error.config;
  const refreshToken = getRefreshToken();

  if (isValidJWT(refreshToken) && originalRequest.headers) {
    try {
      const { data } = await requestNewAccessToken(refreshToken);
      setUserInApplication(data, setContext);

      // * retry original request with new token
      originalRequest.headers.Authorization = 'Bearer ' + data.token;
      return axios(originalRequest);
    } catch (error) {
      log.error({ message: 'Error while refreshing token' });
    }
  }

  log.error({ message: 'Session expired, logging out...' });
  if (isUserAuthenticated()) {
    return logout();
  } else {
    return;
  }
};

export const requestNewAccessToken = async (refreshToken: UserType['refreshToken']) => {
  let response = await fetch(`${VITE_API_URL}/refreshToken`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  const { token } = await response.json();

  response = await fetch(`${VITE_LEGACY_API_URL}/session/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  const { sessions } = await response.json();

  return { data: { token, sessions } as UserType };
};
