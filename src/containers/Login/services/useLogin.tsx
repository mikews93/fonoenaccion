// @vendors
import axios, { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useMutationRequest } from 'shared/hooks/useRequest';
import { UserType } from 'shared/types/userType';
import { setUserInApplication } from 'shared/utils/Auth';

export type LoginRequest = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

type LoginFunctionType = ({ username, password }: LoginRequest) => Promise<
  | {
      data?: UserType | null;
      error?: null;
    }
  | {
      error: AxiosError;
      data?: undefined;
    }
>;

type UseLoginOptionsType = {
  isLoginIn: boolean;
};

type UseLoginType = () => [LoginFunctionType, UseLoginOptionsType];

export const useLogin: UseLoginType = () => {
  /**
   * hooks
   */
  const [sharedData, setSharedData] = useSharedDataContext();

  /**
   * Queries
   */
  const [loginFN, { isLoading, error }] = useMutationRequest<
    { email: string; password: string },
    UserType
  >('/users/login');

  /**
   * Callbacks
   */
  const login = useCallback(
    async ({ username, password }: LoginRequest) => {
      try {
        setSharedData((sharedData) => ({
          ...sharedData,
          user: { ...sharedData.user, isFetching: true },
        }));
        const { data: userInfo, error } = await loginFN({
          email: username,
          password,
        });
        // * in case of error return it
        if (error) {
          return { data: null, error };
        }

        if (userInfo) {
          if (!!sharedData.selectedClient) {
            const { data: clientCfg } = await axios.get(
              `${sharedData.settings.apiUrl}/clients/${sharedData.selectedClient}/offboarding`,
              {
                headers: {
                  Authorization: `Bearer ${userInfo?.token}`,
                },
              }
            );
            userInfo.clientConfig = { hasWistiaConfig: clientCfg.wistia };
          }

          if (sharedData.settings.enableSocket) {
            // TODO remove this when new Trafficker does not use GUID to authenticate
            const { data: legacyUserInfo } = await axios.get(
              [sharedData.settings.legacyApiUrl, 'session/me'].join('/'),
              {
                headers: {
                  Authorization: `Bearer ${userInfo?.token}`,
                },
              }
            );
            userInfo.sessions = legacyUserInfo.sessions;
          }

          setUserInApplication(userInfo, setSharedData);
        }
        return { data: userInfo, error: null };
      } catch (error) {
        return { data: null, error };
      } finally {
        setSharedData((sharedData) => ({
          ...sharedData,
          user: { ...sharedData.user, isFetching: false },
        }));
      }
    },
    [setSharedData]
  );

  return [login, { isLoginIn: isLoading, error }];
};
