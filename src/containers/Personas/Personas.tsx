import { MouseEvent } from 'react';
import { Button, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';

// @types
import { PersonaType } from 'shared/types/personaType';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug } from 'shared/utils/Strings';

// @constants
import { APP_ROUTES } from 'shared/routes';
import { TABLE_KEYS } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

const Personas = () => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData] = useSharedDataContext();
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Queries
   */
  const [data, { mutate }] = useGetRequest<PersonaType[]>(location.pathname);
  const [deletePersona] = useMutationRequest();

  /**
   * Callbacks
   */
  const handleEditPersona = ({ id }: PersonaType) => navigate(`${location.pathname}/${id}`);
  const handleClickNewPersona = () => navigate(`/${APP_ROUTES.NEW_PERSONA}`);

  /**
   * Conditional renders
   */
  const columns: EnhancedColumn<PersonaType>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      className: styles.nameColumn,
    },
    {
      key: 'language',
      title: 'Language',
      dataIndex: 'language',
      render: (value, { defaultFor }) => (
        <Typography.Text>
          {value} {defaultFor && <Typography.Text strong>(Default)</Typography.Text>}
        </Typography.Text>
      ),
      className: styles.languageColumn,
    },
    {
      key: 'updatedAt',
      title: 'Last updated',
      dataIndex: 'updatedAt',
      columnType: COLUMN_TYPE.DATE,
      className: styles.lastUpdateColumn,
    },
    {
      width: 100,
      render: (_, row) => {
        const onClickEdit = () => handleEditPersona(row);
        const onConfirmDelete = async (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          const { error } = await deletePersona(
            null,
            'DELETE',
            [location.pathname, row.id].join('/')
          );
          if (error) {
            return errorNotification('Personas error', 'Could not delete Persona', { error });
          }

          mutate(data.filter(({ id }) => id !== row.id));
          return successNotification('Success', 'Persona deleted successfully');
        };

        const shouldDisableDeleteButton = !!row.defaultFor;

        return [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EditOutlined />}
            title='Edit'
            onClick={onClickEdit}
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
              disabled={shouldDisableDeleteButton}
            />
          </Popconfirm>,
        ];
      },
    },
  ];

  const renderExtraButtons = () => (
    <Space>
      <Button type='primary' icon={<PlusOutlined />} onClick={handleClickNewPersona} size='large'>
        New
      </Button>
    </Space>
  );

  return (
    <ContainerPage title='Personas'>
      <Table<PersonaType>
        tableKey={TABLE_KEYS.PERSONAS}
        columns={columns}
        dataSource={data}
        extra={renderExtraButtons()}
        name='All Personas'
        onRowClick={handleEditPersona}
        textFilter={sharedData.searchText}
      />
    </ContainerPage>
  );
};

export default Personas;
