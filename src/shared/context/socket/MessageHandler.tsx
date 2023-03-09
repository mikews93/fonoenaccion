import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';

// @hooks
import { useNotifications, useNotificationType } from 'shared/hooks/useNotifications';

// @constants
import {
  DEBOUNCE_TIME,
  INGEST_MESSAGES,
  NOTIFICATION_SOURCES,
  SOCKET_CHANNELS,
} from 'shared/constants';
import { APP_ROUTES } from 'shared/routes';

// @types
import { SpielType } from 'shared/types/spielType';
import { useSharedDataContext } from '../useSharedData';

type SpielSocketType = { code: INGEST_MESSAGES; msg: string; id: SpielType['id'] };

type MessageType = {
  errors: any[];
  spiels: SpielSocketType[];
  uri: string;
};

export type MessageHandlerFunctionType = (
  channel: SOCKET_CHANNELS,
  message: MessageType,
  notifications?: useNotificationType
) => void;

export const useMessageHandler = () => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [{ settings }] = useSharedDataContext();

  /**
   * Callbacks
   */
  const isCurrentSpielPage = (spielId: SpielType['id']) =>
    location.pathname.includes(`${APP_ROUTES.SPIELS}/${spielId}`);

  const messageSwitcher: MessageHandlerFunctionType = (channel, message) => {
    switch (channel) {
      case SOCKET_CHANNELS.DONE:
        if (!message.spiels?.length) {
          return;
        }
        const { errors, spiels } = message;
        // Get properties from first spiel
        let [{ code, msg, id }] = spiels;

        if (errors || code === INGEST_MESSAGES.ERROR || code === INGEST_MESSAGES.LOCKED) {
          const errorDetail = errors || msg;
          errorNotification(NOTIFICATION_SOURCES.INGESTER, errorDetail, { error: errorDetail });
        } else if (code === INGEST_MESSAGES.UPLOADED) {
          successNotification(NOTIFICATION_SOURCES.INGESTER, 'Files uploaded');
        }

        let name: string = 'Reload';
        let onClick = () => {};
        const path: string = `/${APP_ROUTES.SPIELS}/${id}`;
        const isCurrentPage = isCurrentSpielPage(id);

        switch (code) {
          case INGEST_MESSAGES.CREATE:
            msg = 'Spiel created successfully';
            name = 'View';
            onClick = () => location.replace(path);
            break;
          case INGEST_MESSAGES.UPDATE:
            msg = 'Spiel updated successfully';
            name = isCurrentPage ? name : 'View';
            onClick = () => location.replace(path);
            break;
          case INGEST_MESSAGES.ERROR:
          case INGEST_MESSAGES.LOCKED:
          case INGEST_MESSAGES.UPLOAD:
          default:
            break;
        }

        successNotification(NOTIFICATION_SOURCES.INGESTER, msg, {
          action: {
            name,
            onClick,
            icon: isCurrentPage ? <ReloadOutlined /> : <EyeOutlined />,
          },
        });
        break;

      case SOCKET_CHANNELS.PUBLISH_COMPLETE:
        const [client, file] = message.uri.split('/').slice(-2);
        const url = [settings.videateVideoUrl, client, file].join('/');

        successNotification(NOTIFICATION_SOURCES.INGESTER, `Spiel Rendered`, {
          action: {
            name: 'View file',
            onClick: () => window.open(url, '_blank')?.focus(),
          },
        });
        break;
      default:
        break;
    }
  };

  return messageSwitcher;
};
