import { MouseEvent, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Typography } from 'antd';

// @components
import { ReplacementModal } from 'components/ReplacementModal/ReplacementModal';
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useLocation } from 'react-router-dom';

// @types
import { Replacement } from 'shared/types/replacementTypes';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug } from 'shared/utils/Strings';

// @styles
import styles from './styles.module.scss';
import { REPLACEMENT_TYPES, TABLE_KEYS } from 'shared/constants';

const replacementModalInitialState: { open: boolean; replacement?: Replacement } = {
  open: false,
  replacement: undefined,
};

export default function Replacements() {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData] = useSharedDataContext();
  const location = useLocation();
  /**
   * State
   */
  const [replacementModalState, setReplacementModalState] = useState(replacementModalInitialState);

  /**
   * Queries
   */
  const [data, { mutate, isLoading }] = useGetRequest<Replacement[]>(location.pathname, {
    where: {
      clientid: sharedData.selectedClient,
    },
  });
  const [deleteReplacement] = useMutationRequest();

  /**
   * Callbacks
   */
  const handleCloseReplacementModal = (options: any) => {
    setReplacementModalState(replacementModalInitialState);
    if (options?.refreshQuery) {
      mutate([]);
    }
  };
  const handleAddNewReplacement = () => setReplacementModalState({ open: true });
  const handleEditReplacement = ({ languages, ...replacement }: Replacement) =>
    setReplacementModalState({
      open: true,
      replacement: { ...replacement, languages: languages?.toString().split(',') },
    });
  const handleDeleteReplacement = async (replacement: Replacement) => {
    const { error } = await deleteReplacement(
      null,
      'DELETE',
      [location.pathname, replacement.id].join('/')
    );
    if (error) {
      return errorNotification('Replacements error', 'Could not delete Replacement', {
        error,
      });
    }

    mutate(data.filter(({ id }) => id !== replacement.id));
    return successNotification('Success', 'Replacement deleted successfully');
  };

  /**
   * Conditional renders
   */
  const columns: EnhancedColumn<Replacement>[] = [
    {
      key: 'source',
      title: 'Source',
      dataIndex: 'target',
      className: styles.sourceColumn,
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'repltype',
      render: (value: string) => {
        const type = value.toUpperCase() as keyof typeof REPLACEMENT_TYPES;
        return REPLACEMENT_TYPES[type] || '-';
      },
      className: styles.typeColumn,
    },
    {
      key: 'replacement',
      title: 'Replacement',
      dataIndex: 'replacement',
      className: styles.replacementColumn,
    },
    {
      key: 'languages',
      title: 'Languages / Region',
      dataIndex: 'languages',
      columnType: COLUMN_TYPE.LANGUAGE,
      className: styles.languagesColumn,
    },
    {
      key: 'created_at',
      title: 'Created At',
      dataIndex: 'createdAt',
      columnType: COLUMN_TYPE.DATE,
      className: styles.createdColumn,
    },
    {
      width: 100,
      render: (_, row) => {
        const onClickEdit = () => handleEditReplacement(row);
        const onConfirmDelete = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteReplacement(row);
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
            placement='bottomLeft'
            key={generateSlug()}
            title={
              <Typography.Text>
                Are you sure to delete <strong>{row.target}</strong>?
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
    <ContainerPage className={styles.replacements} title='Replacements'>
      <Table<Replacement>
        tableKey={TABLE_KEYS.REPLACEMENT}
        extra={
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleAddNewReplacement}
            size='large'
          >
            New
          </Button>
        }
        loading={isLoading}
        name='All Replacements'
        columns={columns}
        dataSource={data}
        onRowClick={handleEditReplacement}
        textFilter={sharedData.searchText}
      />
      <ReplacementModal {...replacementModalState} onCancel={handleCloseReplacementModal} />
    </ContainerPage>
  );
}
