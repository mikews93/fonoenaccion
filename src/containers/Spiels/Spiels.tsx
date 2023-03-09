import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { UserColumn } from 'components/UserColumn/UserColumn';
import { DropZone } from 'components/DropZone/DropZone';
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';

// @hook
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug } from 'shared/utils/Strings';
import { formatDate } from 'shared/utils/Date';

// @constants
import { APP_ROUTES } from 'shared/routes';
import { SPIEL_UPLOAD_CONFIG, TABLE_KEYS } from 'shared/constants';

// @types
import { SpielType } from 'shared/types/spielType';
import { UserType } from 'shared/types/userType';

// @styles
import styles from './styles.module.scss';

const Spiels = () => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData] = useSharedDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * refs
   */
  const dropZoneRef = useRef<any>();

  /**
   * State
   */
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  /**
   * Queries
   */
  const [spiels, { isLoading, mutate }] = useGetRequest<SpielType[]>(location.pathname);
  const [mutateSpiel, { isLoading: isDeletingSpiel }] = useMutationRequest<any, SpielType>();
  useEffect(() => {
    mutate(spiels);
  }, [sharedData.selectedProject?.id]);

  /**
   * callbacks
   */
  const handleTriggerUploadOverlay = () => setShowUploadOverlay(true);
  const handleEditSpiel = (spielId: SpielType['id']) => navigate(spielId.toString());
  const handleRowClick = (row: SpielType) => handleEditSpiel(row.id);
  const handleClickNewSpiel = () =>
    navigate(APP_ROUTES.NEW_SPIEL.replace(`${APP_ROUTES.SPIELS}/`, ''));

  const handleDeleteSpiel = async (spielId: SpielType['id']) => {
    const { error } = await mutateSpiel(null, 'DELETE', [location.pathname, spielId].join('/'));
    if (error) {
      return errorNotification('Spiel error', 'Could not delete Spiel', error);
    }

    mutate(spiels.filter(({ id }) => id !== spielId));
    return successNotification('Success', 'Spiel deleted successfully');
  };

  const handleSuccessUpload = useCallback(() => {
    mutate([]);
    return successNotification('Success', 'Spiel added successfully');
  }, [mutate]);

  /**
   *
   * Conditional renderings
   */
  const columns: EnhancedColumn<SpielType>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 400,
    },
    {
      title: 'Persona',
      dataIndex: 'name',
      key: 'name',
      className: styles.personaColumn,
    },
    {
      title: 'Last updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      columnType: COLUMN_TYPE.DATE,
      className: styles.lastUpdateColumn,
    },
    {
      title: 'Checked out by',
      dataIndex: 'locked_by',
      key: 'locked_by',
      render: (value, { locked_at }) => (
        <UserColumn
          user={{ fullName: value } as UserType}
          tooltip={`Locked at: ${formatDate(locked_at)}`}
          noUserTooltip='Not currently checked out'
        />
      ),
      columnType: COLUMN_TYPE.USER,
      filterable: true,
      className: styles.checkedOutColumn,
    },
    {
      title: 'Created by',
      dataIndex: 'created_by',
      key: 'created_by',
      columnType: COLUMN_TYPE.USER,
      className: styles.createdColumn,
    },
    {
      title: 'Last updated by',
      dataIndex: 'updated_by',
      key: 'updated_by',
      columnType: COLUMN_TYPE.USER,
      className: styles.lastUpdateColumn,
    },
    {
      key: 'actions',
      width: 100,
      render: (_, row) => {
        const onClickEdit = () => handleEditSpiel(row.id);
        const onConfirmDeleteSpiel = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteSpiel(row.id);
        };

        return [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EditOutlined />}
            title='Edit'
            onClick={onClickEdit}
          />,
          <Popconfirm
            placement='left'
            key={generateSlug()}
            title={
              <Typography.Text>
                Are you sure to delete <strong>{row.title}</strong>?
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
        ];
      },
    },
  ];


  const renderExtraButtons = () => (
    <Space>
      <Button type='primary' icon={<PlusOutlined />} onClick={handleClickNewSpiel} size='large'>
        New
      </Button>
      <Button
        type='primary'
        icon={<UploadOutlined />}
        onClick={handleTriggerUploadOverlay}
        size='large'
      >
        Upload
      </Button>
    </Space>
  );

  return (
    <ContainerPage title='Spiels'>
      <DropZone
        ref={dropZoneRef}
        config={Object.assign(SPIEL_UPLOAD_CONFIG, {
          metaFields: {
            body: JSON.stringify({
              clientId: sharedData.selectedClient,
              projectId: sharedData.selectedProject?.id,
            }),
          },
        })}
        isOverlayActive={showUploadOverlay}
        setIsOverlayActive={setShowUploadOverlay}
        onSuccessUpload={handleSuccessUpload}
      >
        <Table<SpielType>
          tableKey={TABLE_KEYS.SPIELS}
          columns={columns}
          dataSource={spiels}
          extra={renderExtraButtons()}
          loading={isLoading || isDeletingSpiel}
          name='All Spiels'
          onRowClick={handleRowClick}
          parentRef={dropZoneRef}
          currentUserName={sharedData.user.info?.name}
          textFilter={sharedData.searchText}
        />
      </DropZone>
    </ContainerPage>
  );
};

export default Spiels;
