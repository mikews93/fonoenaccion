import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useGetRequest } from 'shared/hooks/useRequest';
import { getItem } from 'shared/utils/MenuItem';

// @styles
import styles from './styles.module.scss';

export const VideoUsage = () => {
  /**
   * hooks
   */
  const [sharedData] = useSharedDataContext();
  /**
   * queries
   */
  const [timeUsed, { isLoading }] = useGetRequest<{ seconds: number }>(
    `/videos/usage/${sharedData.selectedClient || 0}`,
    null
  );

  const formatTime = (secs: number) => {
    const lpad = (str: number | string) => {
      return Number(str) >= 10 ? str : '0' + str;
    };

    const hours = lpad(Math.floor(secs / 3600));
    const seconds = lpad(Number(secs % 60).toFixed(0));
    const minutes = lpad(Math.floor(secs / 60) % 60);

    return `${hours}:${minutes}:${seconds}`;
  };

  return getItem({
    key: 'usage',
    label: `Used: ${formatTime(timeUsed.seconds)}`,
    icon: isLoading ? <LoadingOutlined /> : <ClockCircleOutlined />,
    className: styles.videoUsage,
  });
};
