import { useContext, useMemo } from 'react';
import { SocketContext } from './SocketContext';

export const useSocket = () => {
  const { socket, messages } = useContext(SocketContext);

  const lastMessage = useMemo(() => messages?.slice(-1)[0], [messages]);

  const value = useMemo(
    () => ({
      socket,
      messages,
      lastMessage,
    }),
    [socket, messages, lastMessage]
  );

  return value;
};
