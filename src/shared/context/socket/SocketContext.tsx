import { createContext } from 'react';
import { SOCKET_CHANNELS } from 'shared/constants';
import { Socket } from 'socket.io-client';
import { MessageHandlerFunctionType } from './MessageHandler';

type ServerToClientEvents = {
  reconnect: (d: string, callback: (e: number) => void) => void;
  reconnect_attempt: (d: string, callback: (e: number) => void) => void;
  message: MessageHandlerFunctionType;
};

type ClientToServerEvents = {
  auth: {
    bearerToken?: string;
    projectId?: string;
  };
};

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export type SocketContextType = {
  socket?: SocketType;
  messages: { channel: SOCKET_CHANNELS; message: string }[];
};

export const SocketContext = createContext<SocketContextType>({
  messages: [{ channel: SOCKET_CHANNELS.DONE, message: '' }],
});
