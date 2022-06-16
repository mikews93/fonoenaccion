import axios from 'axios';

// @constants
import { AUTH_PROFILE, REQUEST_STATUS_CODES } from 'shared/constants';

// @routes
import { ROUTES } from 'shared/routes';

// @utils
import { logout } from 'shared/utils/Auth';
import { getLocalStorage } from 'shared/utils/LocalStorage';
import { log } from 'shared/utils/Log';
import { client } from 'shared/sanity/client';

export type RequestObject = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: any;
  timeout?: number;
  params?: any;
  isSanity?: boolean;
}

const { VITE_API_URL } = import.meta.env;

const SANITY_METHOD_MAPPER = {
  GET: 'query',
  POST: 'create',
  PUT: 'mutate',
  DELETE: 'delete',
  PATCH: 'mutate',
}

const getToken = () => {
  const { token } = getLocalStorage(AUTH_PROFILE);
  return token;
}

const createHeaders = (isfileUpload = false) =>  {
  const headers = {
    Accept: 'application/json',
    'Content-Type': !isfileUpload
      ? 'application/json'
      : 'multipart/form-data',
    Authorization: ''
  };
  const token = getToken();
  if (token && token.length >= 30) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
}

const requestCall = ({ method = 'GET', url, data, headers, timeout, params }: Omit<RequestObject, 'isSanity'>) => {
  axios.defaults.baseURL = VITE_API_URL;
  axios.defaults.timeout = timeout || 20000;

  return axios({
    url,
    method: method.toLowerCase(),
    headers: Object.assign({}, createHeaders(), headers),
    data,
    params,
  });
}

const sanityCall = ({ method = 'GET', url, data, params }:  Omit<RequestObject, 'isSanity'>) => { 
  switch (SANITY_METHOD_MAPPER[method || 'GET']) {
    case SANITY_METHOD_MAPPER.POST:
      return client.create(data).then((res: any) => res);
    case SANITY_METHOD_MAPPER.PUT:
      return client.mutate(data).then((res:any) => res);
    case SANITY_METHOD_MAPPER.DELETE:
      return client.delete(data).then((res:any) => res);
    default:
      return client.fetch(url, params).then((res:any) => res);
  }
}

export const getFetcher = ({ isSanity, ...options }: Omit<RequestObject, 'url'>) =>
  (url: string) => {
    if (isSanity) {
      return sanityCall({ url,  ...options });
    }

    return requestCall({ url,  ...options }).then((res: any) => res.data || res)
  }

export const SWR_CONFIG = {
  suspense: true,
  onError: (error: any, key: string) => {
    switch (error.status) {
      case REQUEST_STATUS_CODES.UNAUTHORIZED:
        log.error({ message: 'Session expired, logging out...' });
        logout();
        return window.location.replace(ROUTES.LOGIN)
      case REQUEST_STATUS_CODES.NOT_FOUND:
        return window.location.replace(ROUTES.NOT_FOUND);
      default:
        // We can send the error to Sentry,
        // or show a notification UI.
        return log.error(error, key);
    }
  }
}

