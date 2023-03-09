import { useState } from 'react';
import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, MenuProps, Typography } from 'antd';

// @types
import { Environment } from 'shared/types/environments';
import { Instance } from 'shared/types/instanceTypes';

// @components
import { EnvironmentsSelectionModal } from 'components/EnvironmentsSelectionModal/EnvironmentsSelectionModal';
import { InstanceItem } from 'components/InstanceItem/InstanceItem';
import { DotBadge } from 'components/DotBagde/DotBadge';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useInstanceMessageHandler } from '../InstanceItem/useInstanceMessageHandler';

// @constants
import { INSTANCE_STATUS } from 'shared/constants';

// @utils
import { generateSlug } from 'shared/utils/Strings';
import { getItem } from 'shared/utils/MenuItem';

// @styles
import styles from './styles.module.scss';
import { usePreviewerPopup } from 'shared/hooks/usePreviewerPopup';

export const Instances = (collapsed: boolean) => {
  /**
   * hooks
   */
  const [
    {
      settings: { legacyApiUrl },
    },
  ] = useSharedDataContext();
  const { errorNotification, successNotification } = useNotifications();

  const { openPreviewer } = usePreviewerPopup();

  /**
   * queries
   */
  const queryKey = `${legacyApiUrl}/instances`;
  const [instances, { mutate: refreshInstances, isLoading: isFetchingInstances }] =
    useGetRequest<Instance[]>(queryKey);
  const PRIs = [...(instances || {})].filter(({ clientPodName }) => !clientPodName);
  const [changeInstanceEnv] = useMutationRequest<
    { id: Instance['id']; envId: Environment['id'] },
    any
  >(`${queryKey}/env`, 'PUT');
  const [createInstance] = useMutationRequest<{ envId: Environment['id'] }, any>(queryKey);
  const [deleteInstance, { isLoading: isDeletingInstance }] = useMutationRequest<
    { id: Instance['id'] },
    any
  >(queryKey, 'DELETE');

  /**
   * hooks
   */
  const { status: jobStatus, percent, type } = useInstanceMessageHandler(refreshInstances);

  /**
   * State
   */
  const [showEnvironmentSelection, setShowEnvironmentSelection] = useState(false);

  /**
   * Callbacks
   */
  const handleOpenEnvironmentModal = () => setShowEnvironmentSelection(true);
  const handleCloseEnvironmentSelection = () => setShowEnvironmentSelection(false);
  const handleDeleteInstance = async (id: Instance['id']) => {
    const { error } = await deleteInstance({ id });
    if (error) {
      return errorNotification('Instance', 'Could not launch a new Instance', { error });
    }
    refreshInstances([]);
    return successNotification('Instance', <Typography.Text>Instance was removed</Typography.Text>);
  };
  const handleSelectEnvironment = async (envId: Environment['id']) => {
    if (PRIs.length) {
      const [instance] = PRIs;
      const { error } = await changeInstanceEnv({ id: instance.id, envId });
      if (error) {
        return errorNotification('Instance', 'Could not change Instance environment', { error });
      }
      successNotification('Instance', 'Instance Environment changed successfully');
    } else {
      const { error } = await createInstance({ envId });
      if (error) {
        return errorNotification('Instance', 'Could not launch a new Instance', { error });
      }
      successNotification('Instance', 'Launching new Instance, please wait a couple of seconds');
      refreshInstances([]);
    }
  };

  /**
   * Conditional rendering
   */
  const instanceActions = (status: INSTANCE_STATUS, id: Instance['id']): MenuProps['items'] => [
    {
      key: 'stop',
      label: 'Stop',
      onClick: () => handleDeleteInstance(id),
      icon: isDeletingInstance ? <LoadingOutlined /> : <PauseCircleOutlined />,
      disabled: status !== INSTANCE_STATUS.INSTANCE_LAUNCHED,
    },
    {
      key: 'change-environment',
      label: 'Change Environment',
      onClick: handleOpenEnvironmentModal,
      icon: <ReloadOutlined />,
      disabled: status !== INSTANCE_STATUS.INSTANCE_LAUNCHED,
    },
    {
      key: 'open-previewer',
      label: 'Open Previewer',
      onClick: () => openPreviewer(),
      icon: <PlayCircleOutlined />,
      disabled: false,
    },
  ];

  const renderSubitem = () => [
    getItem({
      key: 'instance',
      label: (
        <div>
          {PRIs.length || isFetchingInstances ? (
            PRIs.map(({ environment, status, id }) => (
              <InstanceItem
                loading={isFetchingInstances}
                actions={instanceActions(status, id)}
                key={id}
                name={environment?.name || ''}
                status={(jobStatus || status) as INSTANCE_STATUS}
                refreshInstances={() => refreshInstances([{ id: generateSlug() } as Instance])}
                percent={percent}
                jobType={type}
              />
            ))
          ) : (
            <Button type='primary' shape='round' size='large' onClick={handleOpenEnvironmentModal}>
              Launch
            </Button>
          )}
          <EnvironmentsSelectionModal
            open={showEnvironmentSelection}
            onCancel={handleCloseEnvironmentSelection}
            onSelect={handleSelectEnvironment}
          />
        </div>
      ),
    }),
  ];

  return getItem({
    className: styles.instances,
    key: 'Instances',
    label: 'Instances',
    children: collapsed ? null : renderSubitem(),
    icon: !collapsed || <DotBadge status={PRIs?.[0]?.status} />,
    expandIcon: <></>,
  });
};
