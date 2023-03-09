// @vendors
import { useFlags, useLDClient, withLDProvider } from 'launchdarkly-react-client-sdk';
import { ReactNode, useEffect, useRef, useState } from 'react';

// @context
import { SharedDataContext, SharedDataType } from './sharedDataContext';

// @contextProvider
import { SocketProvider } from './socket/SocketProvider';
import { ThemeProvider } from './themeProvider';

// @constants
import { SHARED_DATA_INITIAL_STATE } from './constants';

// @hooks
import { useScreen } from 'shared/hooks/useScreen';

// @utils
import { isUserAuthenticated, revalidateUserInfo } from 'shared/utils/Auth';

interface SharedDataProviderProps {
  children: ReactNode;
}

const DataProvider = ({ children }: SharedDataProviderProps) => {
  /**
   * Hooks
   */
  const { isMobile } = useScreen();
  const featureFlags = useFlags();
  const client = useLDClient();
  const tokenRef = useRef<string | undefined>();

  /**
   * State
   */
  const [sharedData, setSharedData] = useState<SharedDataType>(SHARED_DATA_INITIAL_STATE);
  const [rtTimeout, setRTTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Effects
   */
  useEffect(() => {
    // * Identify logged in user on LD
    if (client && sharedData.user.info?.id) {
      const { id, name, email } = sharedData.user.info;
      client.identify({ key: id?.toString(), name, email });
    }

    return () => {
      client?.close();
    };
  }, [client, sharedData]);
  useEffect(() => {
    const appToken = sharedData.user.info?.token;
    const refreshToken = async () => {
      if (rtTimeout) {
        clearTimeout(rtTimeout);
      }

      const timeOutId = await revalidateUserInfo(setSharedData);
      setRTTimeout(timeOutId);

      tokenRef.current = appToken;
    };

    const tokenActuallyChange = appToken !== tokenRef.current;
    if (isUserAuthenticated() && tokenActuallyChange) {
      refreshToken();
    }
    return () => {
      if (rtTimeout) {
        clearTimeout(rtTimeout);
      }
    };
  }, [sharedData.user.info?.token]);

  return (
    <SharedDataContext.Provider
      value={{ ...sharedData, featureFlags, setSharedData, isMobileView: isMobile }}
    >
      <ThemeProvider>
        <SocketProvider>{children}</SocketProvider>
      </ThemeProvider>
    </SharedDataContext.Provider>
  );
};

// @ts-ignore
export const SharedDataProvider = withLDProvider<SharedDataProviderProps>({
  clientSideID: SHARED_DATA_INITIAL_STATE.settings.launchDarklyId,
})(DataProvider);
