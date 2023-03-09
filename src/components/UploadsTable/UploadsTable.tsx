import {
  DeleteOutlined,
  ShareAltOutlined,
  TagsOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Tag, Typography } from 'antd';
import { MouseEvent, useState, useCallback } from 'react';

// @components
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';
import { VideoPlayer } from 'components/VideoPlayer/VideoPlayer';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useLocation } from 'react-router-dom';

// @hooks
import { useCopyToClipboard } from 'shared/hooks/useCopyToClipboard';
import { useSessionState } from 'shared/hooks/useSessionState';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug, removeSpecialChars } from 'shared/utils/Strings';
import { isAudio, isVideo } from 'shared/utils/Files';
import { getResourceUrl } from 'shared/utils/Resources';

// @types
import { Upload } from 'shared/types/UploadTypes';

// @constants
import { ASSETS_PATH, MARKUP_TYPES, REPLACEMENT_TEXT, TAG_MODES, UPPY_CONFIG } from './constants';
import { SESSION_KEYS, TABLE_KEYS } from 'shared/constants';
import { TagModeModal } from 'components/TagModeModal/TagModeModal';
import { DropZone } from 'components/DropZone/DropZone';

// @styles
import styles from './styles.module.scss';

const initialVideoPlaterState = { open: false, url: '', playing: false, title: '' };

export const UploadsTable = () => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData] = useSharedDataContext();
  const [copyToClipboard] = useCopyToClipboard({
    onSuccess: successNotification,
    onError: errorNotification,
  });
  const location = useLocation();
  const projectId = sharedData.selectedProject?.id ?? 0;

  /**
   * state
   */
  const [tagModes, setTagMode] = useSessionState<{ [key: string]: TAG_MODES }>(
    SESSION_KEYS.TAG_MODE,
    { [projectId]: TAG_MODES.VIDEATE }
  );
  const tagMode = tagModes[projectId.toString()] ?? TAG_MODES.VIDEATE;

  const [showTagModesModal, setShowTagModesModal] = useState(false);
  const [videoPlayerState, setVideoPlayerState] = useState(initialVideoPlaterState);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  /**
   * Queries
   */
  const [data, { mutate }] = useGetRequest<Upload[]>(
    `/projects/${sharedData.selectedProject?.id}/assets`,
    null
  );
  const [deleteUpload] = useMutationRequest(
    `/projects/${sharedData.selectedProject?.id}/assets`,
    'DELETE'
  );

  /**
   * Callbacks
   */
  const handleCloseTagModeModal = () => setShowTagModesModal(false);
  const handleTagModesClick = () => setShowTagModesModal(true);
  const handleCloseVideoPlayer = () => setVideoPlayerState(initialVideoPlaterState);
  const handleClickUpload = () => setShowUploadOverlay(true);

  const hasTemplate = (upload: Upload) =>
    MARKUP_TYPES[tagMode]?.template[isVideo(upload?.name) ? 'video' : 'image'];

  const handleSelectTagMode = (selectedTagMode: TAG_MODES) => {
    setTagMode({ ...tagModes, [projectId]: selectedTagMode });
    handleCloseTagModeModal();
  };

  const handleRowClick = (upload: Upload) => {
    const url = getLinkUrl(upload.name);
    return isVideo(upload.name)
      ? setVideoPlayerState({ open: true, url, title: upload.name, playing: true })
      : open(url);
  };

  const handleCopyLink = ({ name: fileName }: Upload) => copyToClipboard(getLinkUrl(fileName));

  const getLinkUrl = (fileName: string) =>
    getResourceUrl({
      baseUrl: sharedData.settings.videateVideoUrl,
      projectId: sharedData.selectedProject?.id,
      clientId: sharedData.selectedClient,
      path: 'assets',
      fileName,
    });

  const handleCopyTag = ({ name: fileName }: Upload, isDisabled?: boolean) => {
    if (isDisabled) return;
    const {
      template: { video, image, audio },
    } = MARKUP_TYPES[tagMode];

    let markupTemplate;
    if(isVideo(fileName)) {
      markupTemplate = video;
    } else if(isAudio(fileName)) {
      markupTemplate = audio;
    } else {
      markupTemplate = image;
    }

    if (!markupTemplate) {
      return errorNotification('Upload error', 'Could not copy tag', {
        error: 'No template found',
      });
    }
    const fileLink = getResourceUrl({
      baseUrl: sharedData.settings.videateVideoUrl,
      projectId: sharedData.selectedProject?.id,
      clientId: sharedData.selectedClient,
      path: ASSETS_PATH.replace('/', ''),
      fileName,
    });
    copyToClipboard(markupTemplate?.replace(REPLACEMENT_TEXT, fileLink));
  };

  const handleDeleteUpload = async (uploadName: Upload['name']) => {
    const { error } = await deleteUpload({ name: uploadName });
    if (error) {
      return errorNotification('Personas error', 'Could not delete upload', { error });
    }

    mutate(data?.filter(({ name }) => name !== uploadName));
    return successNotification('Success', 'Upload deleted successfully');
  };

  const handleSuccessUpload = useCallback(() => {
    mutate([]);
  }, [mutate]);

  /**
   * Conditional rendering
   */
  const renderExtra = () => (
    <Space>
      <Tag icon={<TagsOutlined />}>Tag mode: {removeSpecialChars(tagMode)}</Tag>
      <Button type='primary' size='large' icon={<UploadOutlined />} onClick={handleClickUpload}>
        Upload
      </Button>
      <Button
        type='primary'
        size='large'
        icon={<UnorderedListOutlined />}
        onClick={handleTagModesClick}
      >
        Tag mode
      </Button>
    </Space>
  );

  const columns: EnhancedColumn<Upload>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      className: styles.nameColumn,
    },
    {
      key: 'lastModified',
      title: 'Last modified',
      dataIndex: 'lastModified',
      columnType: COLUMN_TYPE.DATE,
      className: styles.lastUpdateColumn,
    },
    {
      key: 'actions',
      width: 130,
      render: (_, row) => {
        const disableCopyTag = !hasTemplate(row);

        const onClickCopyLink = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleCopyLink(row);
        };
        const onClickCopyTag = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleCopyTag(row);
        };
        const onConfirmDelete = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteUpload(row.name);
        };

        return [
          <Button
            key={generateSlug()}
            type='text'
            icon={<ShareAltOutlined />}
            title='Copy link'
            onClick={onClickCopyLink}
          />,
          <Button
            key={generateSlug()}
            type='text'
            icon={<TagsOutlined />}
            title='Copy tag'
            onClick={onClickCopyTag}
            disabled={disableCopyTag}
          />,
          <Popconfirm
            placement='bottomLeft'
            key={generateSlug()}
            title={
              <Typography.Text>
                Are you sure to delete <strong>{row.name}</strong>?
              </Typography.Text>
            }
            onConfirm={onConfirmDelete}
            onCancel={preventDefaultBehavior}
          >
            <Button
              type='text'
              icon={<DeleteOutlined />}
              title='Delete'
              onClick={preventDefaultBehavior}
            />
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <DropZone
      config={Object.assign(UPPY_CONFIG, {
        endpoint: ['projects', sharedData.selectedProject?.id, 'assets'].join('/'),
      })}
      isOverlayActive={showUploadOverlay}
      setIsOverlayActive={setShowUploadOverlay}
      onSuccessUpload={handleSuccessUpload}
    >
      <>
        <Table<Upload>
          extra={renderExtra()}
          tableKey={TABLE_KEYS.UPLOADS}
          name='All Uploads'
          columns={columns}
          dataSource={data}
          rowKey='name'
          textFilter={sharedData.searchText}
          onRowClick={handleRowClick}
          offsetTop={470}
        />
        <TagModeModal
          onSelect={handleSelectTagMode}
          value={tagMode}
          open={showTagModesModal}
          onCancel={handleCloseTagModeModal}
        />
        <VideoPlayer {...videoPlayerState} onClose={handleCloseVideoPlayer} />
      </>
    </DropZone>
  );
};
