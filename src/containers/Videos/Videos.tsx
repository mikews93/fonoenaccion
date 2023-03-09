import { Button, Dropdown, MenuItemProps, MenuProps, Popconfirm, Typography } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { MouseEvent, useState } from 'react';

// @components
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';
import { CustomIcon } from 'components/CustomIcon/CustomIcon';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useDownloadResource } from 'shared/hooks/useDownloadResource';
import { useCopyToClipboard } from 'shared/hooks/useCopyToClipboard';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useLocation } from 'react-router-dom';

// @types
import { Video } from 'shared/types/videoTypes';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug, getFileProps } from 'shared/utils/Strings';
import { getResourceUrl } from 'shared/utils/Resources';

// @constants
import { AUDIO_EXTENSIONS, TABLE_KEYS } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

const initialVideoState = { open: false, url: '', playing: false, title: '' };

export default function Videos() {
  /**
   * hooks
   */
  const location = useLocation();
  const [sharedData] = useSharedDataContext();
  const { errorNotification, successNotification } = useNotifications();
  const [downloadResource, { isDownloadingResource }] = useDownloadResource();
  const [copyToClipboard] = useCopyToClipboard({
    onSuccess: successNotification,
    onError: errorNotification,
  });

  /**
   * State
   */
  const [videoPlayerState, setVideoPlayerState] = useState(initialVideoState);

  /**
   * Queries
   */
  const [data, { mutate, isLoading }] = useGetRequest<Video[]>(
    `${location.pathname}?projectId=${sharedData.selectedProject?.id}`
  );
  const [mutationRequest] = useMutationRequest();

  /**
   * Callbacks
   */
  const handleCloseVideoPlayer = () => setVideoPlayerState(initialVideoState);
  const handleWatchVideo = (video: Video) =>
    setVideoPlayerState({
      open: true,
      playing: true,
      title: video.title,
      url: getResourceUrl({
        baseUrl: sharedData.settings.videateVideoUrl,
        clientId: sharedData.selectedClient,
        fileName: video?.uri,
      }),
    });

  const handleDownloadSrt = (video: Video) =>
    downloadResource({
      baseUrl: sharedData.settings.videateVideoUrl,
      clientId: sharedData.selectedClient,
      fileName: `${video?.uri}.srt`,
    });

  const handleDownloadVtt = (video: Video) =>
    downloadResource({
      baseUrl: sharedData.settings.videateVideoUrl,
      clientId: sharedData.selectedClient,
      fileName: `${video?.uri}.vtt`,
    });

  const handleSendToWistia = async (video: Video) => {
    const { error } = await mutationRequest(
      null,
      'POST',
      [location.pathname, video.id, 'send-to-wistia'].join('/')
    );
    if (error) {
      return errorNotification('Video error', 'Could send Video to Wistia', { error });
    }

    return successNotification(
      'Success',
      <Typography.Text>
        Video <Typography.Text strong>{video.title}</Typography.Text> sent successfully
      </Typography.Text>
    );
  };

  const handleDownloadVideo = async (video: Video) =>
    await downloadResource({ clientId: sharedData.selectedClient, fileName: video.uri });
  const handleDownloadAudio = async (video: Video) => {
    const [fileName] = getFileProps(video.uri);
    await downloadResource({
      clientId: sharedData.selectedClient,
      fileName: `${fileName}${AUDIO_EXTENSIONS.AAC}`,
    });
  };
  const handleCopyUrl = async (video: Video) =>
    copyToClipboard(
      getResourceUrl({
        baseUrl: sharedData.settings.videateVideoUrl,
        clientId: sharedData.selectedClient,
        fileName: video?.uri,
      })
    );
  const handleDeleteVideo = async (video: Video) => {
    const { error } = await mutationRequest(null, 'DELETE', `${location.pathname}/${video.id}`);
    if (error) {
      return errorNotification('Video error', 'Could not delete Video', { error });
    }
    mutate([]);
    return successNotification(
      'Success',
      <Typography.Text>
        Video <Typography.Text strong>{video.title}</Typography.Text> deleted successfully
      </Typography.Text>
    );
  };

  /**
   * Conditional rendering
   */
  const columns: EnhancedColumn<Video>[] = [
    {
      key: 'title',
      title: 'Spiel',
      dataIndex: 'title',
      className: styles.spielColumn,
    },
    {
      key: 'uri',
      title: 'MP4',
      dataIndex: 'uri',
      filterable: true,
      className: styles.mp4Column,
    },
    {
      key: 'createdAt',
      title: 'Rendered',
      dataIndex: 'createdAt',
      columnType: COLUMN_TYPE.DATE,
      className: styles.createdColumn,
    },
    {
      width: 130,
      render: (_, video) => {
        const onClickWatch = () => handleWatchVideo(video);
        const onClickDownloadSRT: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleDownloadSrt(video);
        };
        const onClickDownloadVTT: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleDownloadVtt(video);
        };
        const onClickDownloadVideo: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleDownloadVideo(video);
        };
        const onClickDownloadAudio: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleDownloadAudio(video);
        };
        const onClickSendToWistia: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleSendToWistia(video);
        };
        const onClickCopyUrl: MenuItemProps['onClick'] = (event) => {
          preventDefaultBehavior(event.domEvent as MouseEvent<HTMLElement>);
          handleCopyUrl(video);
        };
        const onConfirmDeleteSpiel = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteVideo(video);
        };

        const items: MenuProps['items'] = [
          {
            key: 'downloadVideo',
            label: 'Download Video',
            onClick: onClickDownloadVideo,
            icon: isDownloadingResource ? <LoadingOutlined /> : <DownloadOutlined />,
          },
          {
            key: 'downloadAudio',
            label: 'Download Audio',
            onClick: onClickDownloadAudio,
            icon: isDownloadingResource ? (
              <LoadingOutlined />
            ) : (
              <CustomIcon src='/images/music-note.svg' />
            ),
          },
          {
            key: 'copyUrl',
            label: 'Copy URL',
            onClick: onClickCopyUrl,
            icon: <CopyOutlined />,
          },
          {
            key: 'downloadVTT',
            label: 'Download CC (VTT)',
            onClick: onClickDownloadVTT,
            icon: <CustomIcon src='/images/vtt.svg' />,
          },
          {
            key: 'downloadSRT',
            label: 'Download CC (SRT)',
            onClick: onClickDownloadSRT,
            icon: <CustomIcon src='/images/srt.svg' />,
          },
        ];

        if (sharedData.clientSettings.hasWistiaConfig) {
          items.push({
            key: 'sendWistia',
            label: 'Send to Wistia',
            disabled: !!video.wistiaId,
            onClick: onClickSendToWistia,
            icon: <CustomIcon src='/images/wistia.svg' />,
          });
        }

        return [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EyeOutlined />}
            title='Watch Video'
            onClick={onClickWatch}
          />,
          <Popconfirm
            placement='left'
            key={generateSlug()}
            title={
              <Typography.Text>
                Are you sure to delete <strong>{video.uri}</strong>?
              </Typography.Text>
            }
            onConfirm={onConfirmDeleteSpiel}
            onCancel={preventDefaultBehavior}
          >
            <Button
              type='text'
              icon={<DeleteOutlined />}
              title='Delete'
              onClick={preventDefaultBehavior}
            />
          </Popconfirm>,
          <Dropdown
            key={generateSlug()}
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <Button type='text' icon={<MoreOutlined />} onClick={preventDefaultBehavior} />
          </Dropdown>,
        ];
      },
    },
  ];

  return (
    <ContainerPage title='Videos'>
      <VideoPlayer {...videoPlayerState} onClose={handleCloseVideoPlayer} />
      <Table<Video>
        tableKey={TABLE_KEYS.VIDEOS}
        name='All Videos'
        columns={columns}
        dataSource={data}
        onRowClick={handleWatchVideo}
        textFilter={sharedData.searchText}
        loading={isLoading}
      />
    </ContainerPage>
  );
}
