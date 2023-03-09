import {
  CaretRightOutlined,
  DeleteOutlined,
  LockOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  SendOutlined,
  UnlockOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, FormInstance, Menu, Popconfirm, Space, Typography } from 'antd';
import { cloneElement, FC, ReactNode, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { mutate } from 'swr';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';

// @types
import { SpielType } from 'shared/types/spielType';
import { usePreviewerPopup } from 'shared/hooks/usePreviewerPopup';

// @styles
import styles from './styles.module.scss';
import { INSTANCE_STATUS, SPIEL_JOB_TYPE } from 'shared/constants';
import { APP_ROUTES } from 'shared/routes';
import { Instance } from 'shared/types/instanceTypes';

interface SpielDetailsControlsProps {
  form: FormInstance<SpielType>;
  isLockedByMe: boolean;
  isLockedByOther: boolean;
  onAfterUpdateSpiel?: (updatedSpiel: SpielType) => any;
  disableActions?: boolean;
}

enum PLAYBACK_COMMANDS {
  START_RENDER = 'renderStart:preview:request',
  START_PREVIEW = 'previewStart:preview:request',
  STOP_PREVIEW = 'previewStop:preview:request',
  OPEN_PREVIEWER = 'previewStart:preview:noRequest',
  RENDER_BACKGROUND = 'renderStart:noPreview:request',
}

export const SpielDetailsControls: FC<SpielDetailsControlsProps> = ({
  form,
  isLockedByMe,
  isLockedByOther,
  onAfterUpdateSpiel,
  disableActions,
}) => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData, setSharedData] = useSharedDataContext();
  const { id: spielId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { openPreviewer } = usePreviewerPopup();

  /**
   * Queries
   */
  const [updateSpiel, { isLoading: isUpdatingSpiel }] = useMutationRequest<SpielType, SpielType>(
    location.pathname,
    'PATCH'
  );
  const [deleteSpiel] = useMutationRequest();
  const [commandsFN] = useMutationRequest<any, { jobId: string }>();
  const [spielLockingFN, { isLoading: isUpdatingLock }] = useMutationRequest<
    { lock: boolean },
    SpielType
  >([location.pathname, 'lock'].join('/'), 'PUT');

  const queryInstances = `${sharedData.settings.legacyApiUrl}/instances`;
  const [instances] = useGetRequest<Instance[]>(queryInstances);

  const noInstancesRunning = useMemo(
    () => !instances.some((instance) => instance.status === INSTANCE_STATUS.INSTANCE_LAUNCHED),
    [instances]
  );

  /**
   * Callbacks
   */
  const prepareSpiel = (spiel: SpielType): SpielType => ({ ...spiel, title: spiel.title.trim() });

  const handleUpdateSpiel = async (silent?: boolean) => {
    const updatedValues = form.getFieldsValue();
    const { error, data } = await updateSpiel(prepareSpiel(form.getFieldsValue()));
    if (error) {
      return errorNotification('Spiel error', 'There was an error while updating Spiel', error);
    }

    onAfterUpdateSpiel?.(data || updatedValues);
    return (
      silent ??
      successNotification(
        'Success',
        <Typography.Text>
          Spiel <Typography.Text strong>{data?.title}</Typography.Text> updated successfully
        </Typography.Text>
      )
    );
  };

  const handleSaveClick = () => handleUpdateSpiel();

  const handleCommand = async (playbackCommand: PLAYBACK_COMMANDS) => {
    const [command, preview, request] = playbackCommand.split(':');
    if (request === 'request') {
      if (isLockedByMe) {
        const saveSilently = true;
        await handleUpdateSpiel(saveSilently);
      }

      const { error, data } = await commandsFN(
        null,
        'POST',
        [sharedData.settings.legacyApiUrl, 'spiels', spielId, 'command', command].join('/')
      );
      if (error || !data?.jobId) {
        return errorNotification('Playback error', 'could not execute action', { error });
      }

      setSharedData({
        ...sharedData,
        spiel: {
          ...sharedData.spiel,
          currentJob: {
            id: data.jobId,
            type: command.includes(SPIEL_JOB_TYPE.PREVIEW)
              ? SPIEL_JOB_TYPE.PREVIEW
              : SPIEL_JOB_TYPE.PUBLISH,
          },
        },
      });
    }

    if (spielId && preview === 'preview') {
      openPreviewer(spielId);
    }
  };

  const handleLockSpiel = async () => {
    const shouldReleaseLock = isLockedByOther || isLockedByMe;
    const { error } = await spielLockingFN({ lock: !shouldReleaseLock });
    if (error) {
      return errorNotification('Locking error', 'Could not update lock', { error });
    }

    mutate(location.pathname);
  };

  const handleDeleteSpiel = async () => {
    const { error } = await deleteSpiel(null, 'DELETE', location.pathname, { revalidate: false });
    if (error) {
      return errorNotification('Spiel error', 'Could not delete Spiel', { error });
    }

    successNotification('Success', 'Spiel deleted successfully');
    navigate(`/${APP_ROUTES.SPIELS}`);
  };

  /**
   * Conditional renderings
   */
  const getLockIcon = (): ReactNode => {
    if (isLockedByMe) {
      return <LockOutlined style={{ color: sharedData.theme?.colorPrimary }} />;
    }

    if (isLockedByOther) {
      return <LockOutlined style={{ color: sharedData.theme?.colorError }} />;
    }

    return <UnlockOutlined />;
  };

  const renderLockButton = (): ReactNode => {
    const updateLockButton = <Button type='dashed' size='large' icon={getLockIcon()} />;

    if (isLockedByOther) {
      return (
        <Popconfirm
          title='This Spiel is checked out by somebody else do you want to check it in?'
          onConfirm={handleLockSpiel}
          okText='Force check in'
          cancelText='No'
        >
          {cloneElement(updateLockButton, {
            title: 'Check in',
          })}
        </Popconfirm>
      );
    } else {
      return cloneElement(updateLockButton, {
        className: styles.updateLockButton,
        onClick: handleLockSpiel,
        children: isLockedByMe ? 'Check in' : 'Check out for editing',
        loading: isUpdatingLock,
      });
    }
  };

  const items = [
    {
      label: 'Delete',
      icon: <DeleteOutlined />,
      onClick: handleDeleteSpiel,
      disabled: !isLockedByMe,
    },
    {
      label: 'Render in background',
      icon: <VideoCameraOutlined />,
      disabled: !isLockedByMe || noInstancesRunning,
      onClick: () => handleCommand(PLAYBACK_COMMANDS.RENDER_BACKGROUND),
    },
    {
      label: 'Open Previewer',
      icon: <CaretRightOutlined />,
      disabled: noInstancesRunning,
      onClick: () => handleCommand(PLAYBACK_COMMANDS.OPEN_PREVIEWER),
    },
  ].map((item, key) => ({ key, ...item }));

  return (
    <Space className={styles.spielDetailControl}>
      {renderLockButton()}
      <Button
        title='Save'
        type='dashed'
        size='large'
        onClick={handleSaveClick}
        disabled={!isLockedByMe}
        icon={<SaveOutlined />}
        loading={isUpdatingSpiel}
      />
      <Button
        title='Preview'
        type='dashed'
        size='large'
        onClick={() => handleCommand(PLAYBACK_COMMANDS.START_PREVIEW)}
        icon={<PlayCircleOutlined />}
        disabled={noInstancesRunning}
      />
      <Button
        disabled={!isLockedByMe || noInstancesRunning}
        type='primary'
        size='large'
        title='Render'
        icon={<SendOutlined />}
        onClick={() => handleCommand(PLAYBACK_COMMANDS.START_RENDER)}
      />
      <Dropdown menu={{ items }} placement='bottomRight' arrow={{ pointAtCenter: true }}>
        <Button type='dashed' size='large' title='More' icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};
