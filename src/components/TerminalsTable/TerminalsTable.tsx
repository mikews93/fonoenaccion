import { Button, Popconfirm, TableProps, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FC, MouseEvent, useEffect, useState } from 'react';

// @components
import { TerminalModal, TerminalModalProps } from 'components/TerminalModal/TerminalModal';
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';

// @types
import { EnvironmentTabItem } from 'components/EnvironmentTabs/EnvironmentTabs';
import { Terminal } from 'shared/types/Terminals';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug, maskPasswordGenerator } from 'shared/utils/Strings';
import { TABLE_KEYS } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

interface TerminalsTableProps extends EnvironmentTabItem, TableProps<any> {
  // * terminalTable specific props
}

const terminalModalInitialState: Partial<TerminalModalProps> = {
  open: false,
  terminal: undefined,
};

export const TerminalsTable: FC<TerminalsTableProps> = ({
  environment,
  showAddNewRecordModal,
  setShowAddNewRecordModal,
  ...tableProps
}) => {
  if (!environment) {
    return null;
  }
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();

  /**
   * Queries
   */
  const [terminals, { isLoading, mutate }] = useGetRequest<Terminal[]>(
    `/environments/${environment.id}/terminals`,
    null
  );
  const [mutateTerminal] = useMutationRequest<Partial<Terminal[]> | null, undefined>(
    `/environments/${environment.id}/terminals`,
    'PUT'
  );

  /**
   * state
   */
  const [terminalModalState, setTerminalModalState] = useState(terminalModalInitialState);
  /**
   * Effects
   */
  useEffect(() => {
    if (showAddNewRecordModal) {
      handleClickNewTerminal();
    } else {
      handleCloseTerminalModal();
    }
  }, [showAddNewRecordModal]);

  /**
   * handlers
   */
  const handleClickNewTerminal = () => setTerminalModalState((state) => ({ ...state, open: true }));
  const handleCloseTerminalModal = () => {
    setTerminalModalState(terminalModalInitialState);
    setShowAddNewRecordModal(false);
  };
  const handleEditTerminal = (terminal: Terminal) =>
    setTerminalModalState({ open: true, terminal });
  const handleDeleteTerminal = async (terminal: Terminal) => {
    const { error } = await mutateTerminal(terminals.filter(({ id }) => id !== terminal.id));
    if (error) {
      return errorNotification('Terminal error', 'Could not delete Terminal', { error });
    }

    mutate([]);
    return successNotification(
      'Awesome!',
      <div>
        Terminal <strong>{terminal.name}</strong> deleted successfully
      </div>
    );
  };
  const handleUpsertTerminal = async (updatedRecord: Terminal, newRecord: boolean) => {
    const mutatedTerminals: Terminal[] = newRecord
      ? [{ ...updatedRecord, id: generateSlug() }, ...terminals]
      : terminals.map((prevTerminal) =>
          prevTerminal.id === updatedRecord.id ? updatedRecord : prevTerminal
        );

    const { error } = await mutateTerminal(mutatedTerminals);
    if (error) {
      errorNotification('Terminal error', `Could not ${newRecord ? 'add' : 'update'} Terminal`, {
        error,
      });
      return { error };
    }

    mutate(mutatedTerminals);
    handleCloseTerminalModal();
    return successNotification(
      'Awesome!',
      <div>
        Terminal <strong>{updatedRecord.name}</strong> {newRecord ? 'added' : 'updated'}
        successfully
      </div>
    );
  };

  /**
   * Conditional renders
   */
  const columns: EnhancedColumn<Terminal>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      className: styles.nameColumn,
    },
    {
      key: 'host',
      title: 'Host name / IP',
      dataIndex: 'host',
      width: '30%',
      columnType: COLUMN_TYPE.LINK,
      className: styles.linkColumn,
    },
    {
      key: 'username',
      title: 'Username',
      dataIndex: 'username',
      className: styles.userColumn,
    },
    {
      key: 'password',
      title: 'Password',
      dataIndex: 'password',
      render: (_, { username }) => <div>{username ? maskPasswordGenerator(8) : username}</div>,
      className: styles.passwordColumn,
    },
    {
      width: 100,
      render: (_, row) => {
        const onClickEdit = () => handleEditTerminal(row);
        const onConfirmDelete = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteTerminal(row);
        };

        const actions = [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EditOutlined />}
            title='Edit'
            onClick={onClickEdit}
            shape='circle'
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
              shape='circle'
            />
          </Popconfirm>,
        ];

        return <div className='flex-end'>{actions}</div>;
      },
    },
  ];

  /**
   * This variable if used to help table component to scroll at
   * the maximum container height, the scrollAt property from table component
   * is calculated on component mount so is not adjustable with css therefore
   * it relies on javascript component provided dimensions which is not always accurate
   */
  const additionalOffset = 240;

  return (
    <>
      <Table<Terminal>
        {...tableProps}
        tableKey={TABLE_KEYS.TERMINALS}
        columns={columns}
        dataSource={terminals}
        loading={isLoading}
        offsetTop={additionalOffset}
        onRowClick={handleEditTerminal}
      />
      <TerminalModal
        {...terminalModalState}
        onOk={handleUpsertTerminal}
        onCancel={handleCloseTerminalModal}
      />
    </>
  );
};
