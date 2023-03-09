import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  MoreOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Popconfirm, Typography } from 'antd';
import { MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';

// @components
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useDownloadResource } from 'shared/hooks/useDownloadResource';
import { useCopyToClipboard } from 'shared/hooks/useCopyToClipboard';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { getResourceUrl } from 'shared/utils/Resources';
import { generateSlug } from 'shared/utils/Strings';
import { TABLE_KEYS } from 'shared/constants';

// @types
import { Screengrab } from 'shared/types/UploadTypes';

// @styles
import styles from './styles.module.scss';

export const ScreengrabsTable = () => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [downloadResource, { isDownloadingResource }] = useDownloadResource();
  const [sharedData] = useSharedDataContext();
  const [copyToClipboard] = useCopyToClipboard({
    onSuccess: successNotification,
    onError: errorNotification,
  });
  const location = useLocation();

  /**
   * Queries
   */
  const [data, { mutate }] = useGetRequest<Screengrab[]>(
    `/projects/${sharedData.selectedProject?.id}/screengrabs`,
    null
  );
  const [deleteUpload] = useMutationRequest();

  /**
   * Callbacks
   */
  const handleCopyLink = (screengrab: Screengrab) => copyToClipboard(getLinkUrl(screengrab.name));
  const handleViewScreengrab = (screengrab: Screengrab) =>
    open(getLinkUrl(screengrab.name), '_blank');
  const handleDownloadScreengrab = (screengrab: Screengrab) =>
    downloadResource({
      clientId: sharedData.selectedClient,
      fileName: screengrab.name,
      path: 'img',
    });

  const getLinkUrl = (fileName: string) =>
    getResourceUrl({
      baseUrl: sharedData.settings.videateVideoUrl,
      clientId: sharedData.selectedClient,
      path: 'img',
      fileName,
    });
  const handleDeleteScreengrab = async (screengrabId: Screengrab['id']) => {
    const { error } = await deleteUpload(
      null,
      'DELETE',
      [location.pathname, screengrabId].join('/')
    );
    if (error) {
      return errorNotification('Personas error', 'Could not delete Persona', { error });
    }

    mutate([]);
    return successNotification('Success', 'Persona deleted successfully');
  };

  /**
   * Conditional rendering
   */
  const columns: EnhancedColumn<Screengrab>[] = [
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
        const onClickCopyLink = () => handleCopyLink(row);
        const onClickView = () => handleViewScreengrab(row);
        const onClickDownloadScreengrab = () => handleDownloadScreengrab(row);
        const onConfirmDelete = async (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteScreengrab(row.id);
        };

        return [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EyeOutlined />}
            title='View'
            onClick={onClickView}
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
          <Dropdown
            key={generateSlug()}
            menu={{
              items: [
                {
                  key: 'downloadScreengrab',
                  label: 'Download screengrab',
                  onClick: onClickDownloadScreengrab,
                  icon: isDownloadingResource ? <LoadingOutlined /> : <DownloadOutlined />,
                },
                {
                  key: 'copyLink',
                  label: 'Copy link',
                  onClick: onClickCopyLink,
                  icon: <ShareAltOutlined />,
                },
              ],
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
    <Table<Screengrab>
      tableKey={TABLE_KEYS.SCREENGRABS}
      name='All Screengrabs'
      columns={columns}
      dataSource={data}
      rowKey='name'
      textFilter={sharedData.searchText}
      offsetTop={470}
    >
      UploadsTable
    </Table>
  );
};
