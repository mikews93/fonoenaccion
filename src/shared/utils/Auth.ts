// @constants
import { AUTH_PROFILE } from "shared/constants";

// @utils
import { getLocalStorage, deleteLocalStorageKeys } from "shared/utils/LocalStorage";

export const isUserAuthenticated = () => {
  const userInfo = getLocalStorage(AUTH_PROFILE);
  return !!userInfo?.token;
};

export const logout = () => {
  deleteLocalStorageKeys([AUTH_PROFILE]);
}