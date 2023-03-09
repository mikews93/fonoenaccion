import { PLAYLIST_FORMATS } from 'containers/Playlists/constants';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';
import { useCopyToClipboard } from 'shared/hooks/useCopyToClipboard';
import { useNotifications } from 'shared/hooks/useNotifications';
import { Playlist } from 'shared/types/playlistTypes';

interface PlaylistLinkProps {
  type: PLAYLIST_FORMATS;
  slug?: Playlist['slug'];
}

export const PlaylistLink: FC<PlaylistLinkProps> = ({ type, slug }) => {
  /**
   * Hooks
   */
  const [sharedData] = useSharedDataContext();
  const { errorNotification, successNotification } = useNotifications();
  const [copyToClipboard] = useCopyToClipboard({
    onError: errorNotification,
    onSuccess: successNotification,
  });

  /**
   * Handlers
   */
  const handleCopyLink = () => copyToClipboard(link);
  const handleDownloadLink = () => open(link, '_blank');

  const link = `${sharedData.settings.downloadPlaylistUrl}/${slug}${type}`;

  return (
    <div className={styles.playlistLink}>
      <div className={styles.type}>{type}</div>
      <div className={styles.link}>{link}</div>
      <div className={styles.actions}>
        <Button icon={<CopyOutlined />} type='text' onClick={handleCopyLink} />
        <Button icon={<DownloadOutlined />} type='text' onClick={handleDownloadLink} />
      </div>
    </div>
  );
};
