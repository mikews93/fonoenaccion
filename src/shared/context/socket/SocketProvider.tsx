// @vendors
import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import io from 'socket.io-client';
import { debounce } from 'lodash';

// @context
import { SocketContext, SocketContextType, SocketType } from './SocketContext';

// @hooks
import { useNotifications } from 'shared/hooks/useNotifications';
import { useSharedDataContext } from '../useSharedData';

// @utils
import { log } from 'shared/utils/Log';
import { MessageHandlerFunctionType, useMessageHandler } from './MessageHandler';
import { ProjectType } from 'shared/types/projectType';

// @constants
import { SOCKET_EVENTS, SOCKET_PATH } from 'shared/constants';

// @types
type SocketProviderProps = {
  children: ReactNode;
};

type SocketAuth = {
  bearerToken: string;
  projectId: ProjectType['id'];
};

const initSocket = (
  jwt?: string,
  projectId?: ProjectType['id'],
  socketUrl?: string,
  guid?: string
) => {

  if (
    jwt === undefined ||
    projectId === undefined ||
    typeof jwt !== 'string' ||
    typeof projectId !== 'number' ||
    socketUrl === undefined
  ) {
    return;
  }

  const socket: SocketType = io(socketUrl, {
    path: SOCKET_PATH,
    auth: {
      bearerToken: jwt,
      projectId,
      guid,
    },
  });

  const debouncedConnect = debounce(() => socket.connect(), 10000);

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    log.debug('Trafficker: connected');
  });

  socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
    log.debug('Trafficker: diconnected', reason);
  });

  socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
    log.error('Trafficker: connect error', error);
    debouncedConnect();
  });

  socket.on(SOCKET_EVENTS.RECONNECT, () => {
    log.debug('Trafficker: reconnect', projectId);
  });

  socket.on(SOCKET_EVENTS.RECONNECT_ATTEMPT, () => {
    log.debug('Trafficker: trying to reconnect');
  });

  return socket;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
  /**
   * Hooks
   */
  const [{ user, selectedProject, featureFlags, settings }] = useSharedDataContext();
  const notifications = useNotifications();
  const messageHandler = useMessageHandler();

  /**
   * refs
   */
  const messageHandlerRef = useRef<MessageHandlerFunctionType>();

  /**
   * State
   */
  const [socket, setSocket] = useState<SocketType>();
  const [messages, setMessages] = useState<SocketContextType['messages']>([]);

  // JWT
  const jwt = user.info?.token;

  const socketMessageHandler = useCallback(
    (rawMessage: string) => {
      const { channel, message } = JSON.parse(rawMessage);
      setMessages((prevState) => [
        ...prevState,
        {
          channel,
          ...message,
        },
      ]);
      messageHandler(channel, message);
    },
    [setMessages, notifications, featureFlags]
  );

  /**
   * Effects
   */
  useEffect(() => {
    if (settings.enableSocket) {
      if (socket) {
        // * Update socket
        socket.disconnect();
        socket.off('message', messageHandlerRef.current);
        if (jwt && selectedProject) {
          socket.auth = {
            ...socket.auth,
            bearerToken: jwt,
            projectId: selectedProject?.id,
            guid: user.info?.sessions?.[0]?.guid,
          };
          socket.on('message', socketMessageHandler);
          messageHandlerRef.current = socketMessageHandler;
          socket.connect();
          // * Re attach handler
        }
      } else {
        // * Create a new socket
        const newSocket = initSocket(
          jwt,
          selectedProject?.id,
          settings.socketUrl,
          user.info?.sessions?.[0].guid
        );
        if (newSocket) {
          newSocket.on('message', socketMessageHandler);
          setSocket(newSocket);
          messageHandlerRef.current = socketMessageHandler;
        }
      }
    }

    return () => {
      if (socket) {
        const { bearerToken, projectId } = socket.auth as SocketAuth;
        if (jwt !== bearerToken || selectedProject?.id !== projectId) {
          socket.disconnect();
        }
      }
    };
    // because adding socket to dependencies will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, selectedProject, user.info, settings.enableSocket]);

  return <SocketContext.Provider value={{ socket, messages }}>{children}</SocketContext.Provider>;
};
