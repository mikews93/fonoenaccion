// @constants
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// @hooks
import { useSocket } from 'shared/context/socket/useSocket';
import { useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @types
import { HighlightType, HIGHLIGHT_TYPE } from 'shared/types/codeEditorTypes';
import { SocketMessageType } from 'shared/types/socketTypes';

// @constants
import { SOCKET_EVENTS, SPIEL_MESSAGES } from 'shared/constants';

// @utils
import { log } from 'shared/utils/Log';

interface MessageHandlerProps {
  socketMessage: string;
}

const initialHighlight = {
  line: -1,
  type: HIGHLIGHT_TYPE.INFO,
};

export const useMessageHandler = (): [HighlightType] => {
  /**
   * hooks
   */
  const [{ settings }, setSharedData] = useSharedDataContext();
  const { errorNotification } = useNotifications();
  const { id: spielId } = useParams();
  const { socket } = useSocket();

  /**
   * queries
   */
  const [stopPreview] = useMutationRequest();

  /**
   * state
   */
  const [highlightBlock, setHighlightBlock] = useState<HighlightType>(initialHighlight);

  /**
   * Effects
   */
  useEffect(() => {
    if (socket) {
      const messageHandlerFN = (socketMessage: any) => messageHandler({ socketMessage });

      socket.on(SOCKET_EVENTS.MESSAGE, messageHandlerFN);

      return () => {
        socket.off(SOCKET_EVENTS.MESSAGE, messageHandlerFN);
      };
    }
  }, [socket]);

  const messageHandler = ({ socketMessage }: MessageHandlerProps) => {
    const { channel, message }: SocketMessageType = JSON.parse(socketMessage);
    const { id, jobId, line: lineNumber } = message;

    switch (channel) {
      case SPIEL_MESSAGES.STREAM_START:
        setHighlightBlock(initialHighlight);
        break;
      case SPIEL_MESSAGES.PROCESSING:
        // TODO: move this to spiel controls component and listen to this message
        // setRenderDisabled(true); // Disable Render button

        // Check we are in current spiel
        if (Number(id) === Number(spielId)) {
          setHighlightBlock((prev) => ({ ...prev, line: message.line || -1 }));
        }
        break;

      case SPIEL_MESSAGES.VIDEO_STOP:
        if (Number(id) === Number(spielId)) {
          log.debug('Trafficker: stopping video');
          stopPreview(
            { jobId },
            'POST',
            `${settings.legacyApiUrl}/spiels/${id}/command/previewStop`
          );
          setSharedData((prevData) => ({
            ...prevData,
            spiel: { ...prevData.spiel, currentJob: undefined },
          }));
        }
        break;

      case SPIEL_MESSAGES.ASSETING_ERROR:
        errorNotification('Assets Error', message.error, message);
        setSharedData((prevData) => ({
          ...prevData,
          spiel: { ...prevData.spiel, currentJob: undefined },
        }));
        break;

      case SPIEL_MESSAGES.ERROR:
        errorNotification('Spiel Error', message.error, { error: message });
        setHighlightBlock({
          type: HIGHLIGHT_TYPE.ERROR,
          line: lineNumber || -1,
          errorMessage: message.error,
        });
        break;

      default:
        break;
    }
  };

  return [highlightBlock];
};
