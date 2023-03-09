import { BarsOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Typography } from 'antd';
import { isNull, omitBy } from 'lodash';
import { useEffect, useState } from 'react';

// @components
import { ComponentList } from 'components/ComponentList/ComponentList';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { ProductsTable } from 'components/ProductsTable/ProductsTable';
import { ContentPane } from 'components/ContentPane/ContentPane';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';

// @types
import { Environment } from 'shared/types/environments';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';

// @styles
import styles from './styles.module.scss';
import { EnvironmentTabs } from 'components/EnvironmentTabs/EnvironmentTabs';

export default function Environments() {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [{ selectedClient, selectedProject, isMobileView }] = useSharedDataContext();

  /**
   * Queries
   */
  const [data, { mutate }] = useGetRequest<Environment[]>(location.pathname);
  const [createEnvironment] = useMutationRequest<Partial<Environment>, Environment>(
    location.pathname
  );
  const [mutateEnvironment] = useMutationRequest();

  /**
   * state
   */
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | undefined>(data[0]);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showModalEnvList, setShowModalEnvList] = useState(false);

  /**
   * Effects
   */
  useEffect(() => {
    setSelectedEnvironment(undefined);
    mutate([]);
  }, [selectedProject?.id]);
  useEffect(() => {
    if (data.length && !selectedEnvironment) {
      setSelectedEnvironment(data[0]);
    }
  }, [data]);

  /**
   * handlers
   */
  const handleCancelAdd = () => setShowNewItem(false);
  const handleClickAdd = () => setShowNewItem(true);
  const handleConfirmAdd = async (environment: Partial<Environment>) => {
    const { error, data } = await createEnvironment({ ...environment, clientid: selectedClient });
    if (error || !data) {
      return errorNotification('Environment error', 'Could not create Environment', { error });
    }

    handleCancelAdd();
    setSelectedEnvironment(data);
    return successNotification(
      'Awesome!',
      <span>
        Environment <strong>{environment.name}</strong> created successfully
      </span>
    );
  };

  const handleDeleteEnvironment = async (environment: Environment) => {
    const { error } = await mutateEnvironment(
      { soft: true },
      'DELETE',
      `${location.pathname}/${environment.id}`
    );
    if (error) {
      return errorNotification('Environment error', 'Could not delete Environment', { error });
    }
    const filteredData = data.filter(({ id }) => id !== environment.id);
    mutate(filteredData);
    if (environment.id === selectedEnvironment?.id) {
      setSelectedEnvironment(filteredData[0]);
    }

    return successNotification(
      'Awesome!',
      <span>
        Environment <strong>{environment.name}</strong> deleted successfully
      </span>
    );
  };

  const handleEditEnvironment = async (environment: Environment) => {
    const { error } = await mutateEnvironment(
      omitBy(environment, isNull),
      'PATCH',
      `${location.pathname}/${environment.id}`
    );
    if (error) {
      return errorNotification('Environment error', 'Could not edit Environment', { error });
    }

    if (selectedEnvironment?.id === environment.id) {
      setSelectedEnvironment(environment);
    }

    mutate([]);
    return successNotification(
      'Awesome!',
      <span>
        Environment <strong>{environment.name}</strong> edited successfully
      </span>
    );
  };

  const handleCloseModalEnvList = () => setShowModalEnvList(false);
  const handleClickExtra = () => setShowModalEnvList(true);
  const handleClickEnv = (env: Environment) => {
    setSelectedEnvironment(env);

    if (isMobileView) {
      handleCloseModalEnvList();
    }
  };

  /**
   * Conditional rendering
   */
  const renderItemActions = (environment: Environment) => {
    const onConfirmDelete = (event: any) => {
      preventDefaultBehavior(event);
      handleDeleteEnvironment(environment);
    };

    return [
      <Popconfirm
        placement='bottomLeft'
        title={
          <Typography.Text>
            Are you sure to delete <strong>{environment.name}</strong>?
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
  };

  const EnvironmentList = (
    <ComponentList<Environment>
      dataSource={data}
      headerProps={{
        content: 'Environments List',
        onAddNewItem: handleClickAdd,
        showAddBtn: true,
        addBtnTitle: 'Create new Environment',
      }}
      newItemProps={{ visible: showNewItem, onCancel: handleCancelAdd, onOk: handleConfirmAdd }}
      onClickItem={handleClickEnv}
      itemActions={renderItemActions}
      selectedItem={selectedEnvironment}
      className={styles.listPane}
    />
  );

  return (
    <ContainerPage
      className={styles.environments}
      title='Environments'
      extra={<Button className={styles.extra} icon={<BarsOutlined />} onClick={handleClickExtra} />}
    >
      <div className={styles.contentLayout}>
        {EnvironmentList}
        <ContentPane
          deletable
          editable
          onDelete={handleDeleteEnvironment}
          onEditHeader={handleEditEnvironment}
          subTitle='Let us know the Products you use'
          title={selectedEnvironment?.name}
          associatedEntity={selectedEnvironment}
          className={styles.contentPane}
        >
          {selectedEnvironment && <EnvironmentTabs environment={selectedEnvironment} />}
        </ContentPane>
      </div>
      <Modal
        open={showModalEnvList}
        footer={null}
        destroyOnClose
        onCancel={handleCloseModalEnvList}
        closable={false}
        className={styles.modalEnvList}
      >
        {EnvironmentList}
      </Modal>
    </ContainerPage>
  );
}
