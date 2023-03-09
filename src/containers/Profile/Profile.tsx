// @components
import { Avatar, Descriptions } from 'antd';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { useSharedDataContext } from 'shared/context/useSharedData';
import ThemeToggle from 'components/ThemeToggle/ThemeToggle';

// @styles
import styles from './styles.module.scss';

export default function Profile() {
  /**
   * Hooks
   */
  const [sharedData] = useSharedDataContext();

  return (
    <ContainerPage title='Profile' className={styles.profile}>
      <div>
        <Avatar
          size='large'
          src={sharedData.user.info?.avatarUrl || '/images/userProfileFallback.png'}
          className='mb-3'
        />
        <Descriptions bordered layout='vertical'>
          <Descriptions.Item label='Name'>{sharedData.user.info?.name}</Descriptions.Item>
          <Descriptions.Item label='Username'>{sharedData.user.info?.email}</Descriptions.Item>
          <Descriptions.Item label='Roles'>{sharedData.user.info?.roles}</Descriptions.Item>
        </Descriptions>
      </div>
      <ThemeToggle />
    </ContainerPage>
  );
}
