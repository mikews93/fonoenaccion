// @hooks
import { useEffect, useRef, useState } from 'react';
import { useSocket } from 'shared/context/socket/useSocket';

// @constants
import { INSTANCE_STATUS, SOCKET_EVENTS, SPIEL_MESSAGES } from 'shared/constants';

// @types
import { SocketMessageType } from 'shared/types/socketTypes';
import { Instance } from 'shared/types/instanceTypes';

const initialJob: Instance['job'] = {
  id: 0,
  percent: 0,
};

export const useInstanceMessageHandler = (refreshInstances: (...args: any) => any) => {
  /**
   * hooks
   */
  const { socket } = useSocket();
  const timer = useRef<NodeJS.Timeout>();

  /**
   * State
   */
  const [job, setJob] = useState(initialJob);

  /**
   * Effects
   */
  useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.MESSAGE, messageHandler);
      // Remove listener on unmount
      return () => {
        socket.off(SOCKET_EVENTS.MESSAGE, messageHandler);
      };
    }
  }, [socket]);

  const messageHandler = (rawMessage: string) => {
    const { channel, message } = JSON.parse(rawMessage) as SocketMessageType;
    const { jobId, percent, type } = message;

    // Clear timeout
    clearTimeout(timer.current);

    switch (channel) {
      case INSTANCE_STATUS.INSTANCE_REQUESTED:
      case INSTANCE_STATUS.INSTANCE_LAUNCHED:
      case INSTANCE_STATUS.INSTANCE_DEREGISTERED:
        setJob({
          type,
          id: jobId,
          status: channel,
          percent: Number(percent),
        });
        refreshInstances();
        break;
      case INSTANCE_STATUS.INSTANCE_BECOME_ENVIRONMENT:
        if (message.initial_launch) {
          break; // don't show "Changing Environment" during initial launch
        }
        setJob({
          type,
          id: jobId,
          status: channel,
          percent: Number(percent),
        });
        break;
      case SPIEL_MESSAGES.ASSETING:
      case SPIEL_MESSAGES.PROCESSING:
      case SPIEL_MESSAGES.ENCODING:
        setJob({
          type,
          id: jobId,
          status: channel,
          percent: Number(percent),
        });
        if (percent === 100) {
          timer.current = setTimeout(refreshInstances(), 5000);
        }
        break;
      case SPIEL_MESSAGES.ASSETING_COMPLETE:
        setJob({
          type,
          id: jobId,
          status: channel,
          percent: 100,
        });
        timer.current = setTimeout(refreshInstances(), 8000);
        break;
      case SPIEL_MESSAGES.STREAM_START:
        setJob({
          type,
          id: jobId,
          status: channel,
          percent: 0,
        });
        break;
      case SPIEL_MESSAGES.PUBLISH_COMPLETE:
      case SPIEL_MESSAGES.VIDEO_STOP:
      case SPIEL_MESSAGES.ERROR:
        setJob({ ...initialJob, status: channel });
        break;
      default:
        break;
    }
  };
  return job;
};
