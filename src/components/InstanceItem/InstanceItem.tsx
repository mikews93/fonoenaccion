import { FC, useMemo, useState } from 'react';
import { WarningFilled, LoadingOutlined, MoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Progress, Tooltip, Typography } from 'antd';
import classNames from 'classnames';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @types
import { STATUS_TYPE } from 'shared/types/instanceTypes';

// @constants
import { INSTANCE_STATUS, SPIEL_JOB_TYPE, SPIEL_MESSAGES } from 'shared/constants';
import { INSTANCE_STATUS_LABEL } from './constants';

// @components
import { FakeProgressBar } from 'components/FakeProgressBar/FakeProgressBar';

// @styles
import styles from './styles.module.scss';
import { DotBadge } from 'components/DotBagde/DotBadge';

interface InstanceItemProps {
  status: INSTANCE_STATUS;
  name: string;
  actions: MenuProps['items'];
  progress?: number;
  disabled?: boolean;
  refreshInstances: (...args: any) => any;
  loading?: boolean;
  percent?: number;
  jobType?: SPIEL_JOB_TYPE;
}

export const InstanceItem: FC<InstanceItemProps> = ({
  status,
  name,
  disabled,
  actions,
  loading,
  percent,
  jobType,
  refreshInstances,
}) => {
  /**
   * hooks
   */
  const [{ theme }] = useSharedDataContext();

  /**
   * State
   */
  const [launchError, setLaunchError] = useState(false);

  /**
   * Callbacks
   */
  const statusLabel: INSTANCE_STATUS_LABEL = useMemo(
    () => getStatusLabel(status, jobType),
    [status, jobType]
  );

  const shouldDisplayProgress = [
    SPIEL_MESSAGES.ASSETING,
    SPIEL_MESSAGES.ASSETING_COMPLETE,
    SPIEL_MESSAGES.STREAM_START,
    SPIEL_MESSAGES.PROCESSING,
    SPIEL_MESSAGES.ENCODING,
  ].includes(status as unknown as SPIEL_MESSAGES);

  const shouldDisplayFakeProgress = [
    INSTANCE_STATUS.INSTANCE_REQUESTED,
    INSTANCE_STATUS.INSTANCE_BECOME_ENVIRONMENT,
  ].includes(status as INSTANCE_STATUS);

  return (
    <div
      className={classNames(styles.instance, { [styles.disabled]: disabled })}
      aria-label={`Instance ${name} status ${statusLabel}`}
    >
      <div>
        {loading ? <LoadingOutlined /> : <DotBadge status={status} />}
        <div className={styles.layout}>
          <div>
            <Typography.Text strong aria-label='instance name' className={styles.name}>
              {name}
            </Typography.Text>
            <Dropdown menu={{ items: actions }} trigger={['click']}>
              <MoreOutlined />
            </Dropdown>
          </div>

          {launchError ? (
            <Tooltip
              placement='right'
              color='white'
              title={
                <Typography.Text>
                  <span>It's taking too long to process. </span>
                  <a href='https://videate.zendesk.com/' target='_blank' rel='noopener noreferrer'>
                    Please contact support
                  </a>
                </Typography.Text>
              }
            >
              <Typography.Text type='warning'>
                <WarningFilled /> Process timeout{' '}
                <Button
                  title='reload'
                  icon={<ReloadOutlined />}
                  type='text'
                  color={theme?.colorWarning}
                  onClick={refreshInstances}
                />
              </Typography.Text>
            </Tooltip>
          ) : (
            <div>
              <Typography.Text className={styles.status}>{statusLabel}</Typography.Text>
              {shouldDisplayFakeProgress && (
                <FakeProgressBar
                  strokeColor={theme?.colorWarning}
                  maxProgress={85}
                  progressTime={30}
                  timeoutLimit={120}
                  handleTimeout={() => {
                    setLaunchError(true);
                  }}
                  ariaLabel={`Instance ${name} status launching`}
                />
              )}

              {shouldDisplayProgress && (
                <Progress
                  percent={percent}
                  status='active'
                  showInfo={false}
                  strokeColor={theme?.colorPrimary}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusLabel = (status: STATUS_TYPE, type?: SPIEL_JOB_TYPE): INSTANCE_STATUS_LABEL => {
  const instanceStatusMapper: { [key in string]: INSTANCE_STATUS_LABEL } = {
    [INSTANCE_STATUS.INSTANCE_DEREGISTERED]: INSTANCE_STATUS_LABEL.READY,
    [INSTANCE_STATUS.INSTANCE_LAUNCHED]: INSTANCE_STATUS_LABEL.READY,
    [INSTANCE_STATUS.INSTANCE_REQUESTED]: INSTANCE_STATUS_LABEL.LAUNCHING,
    [INSTANCE_STATUS.INSTANCE_BECOME_ENVIRONMENT]: INSTANCE_STATUS_LABEL.CHANGING_ENVIRONMENT,
    [SPIEL_MESSAGES.ASSETING]: INSTANCE_STATUS_LABEL.GENERATING_VOICES,
    [SPIEL_MESSAGES.ASSETING_COMPLETE]: INSTANCE_STATUS_LABEL.GENERATING_VOICES,
    [SPIEL_MESSAGES.STREAM_START]:
      type === SPIEL_JOB_TYPE.PREVIEW
        ? INSTANCE_STATUS_LABEL.PREVIEWING
        : INSTANCE_STATUS_LABEL.RECORDING,
    [SPIEL_MESSAGES.PROCESSING]:
      type === SPIEL_JOB_TYPE.PREVIEW
        ? INSTANCE_STATUS_LABEL.PREVIEWING
        : INSTANCE_STATUS_LABEL.RECORDING,
    [SPIEL_MESSAGES.ENCODING]: INSTANCE_STATUS_LABEL.CREATING_MP4,
    [SPIEL_MESSAGES.ERROR]: INSTANCE_STATUS_LABEL.ERROR,
    [SPIEL_MESSAGES.VIDEO_STOP]: INSTANCE_STATUS_LABEL.RELOADING,
  };

  return instanceStatusMapper[status] || INSTANCE_STATUS_LABEL.READY;
};
