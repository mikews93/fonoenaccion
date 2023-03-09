import { Tabs } from 'antd';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { ScreengrabsTable } from 'components/ScreengrabsTable/ScreengrabsTable';
import { UploadsTable } from 'components/UploadsTable/UploadsTable';

// @styles
import styles from './styles.module.scss';

export default function Assets() {
  return (
    <ContainerPage title='Assets' className={styles.assets}>
      <Tabs
        defaultActiveKey='1'
        className={styles.tabs}
        items={[
          {
            key: '1',
            label: 'Uploads',
            children: <UploadsTable />,
          },
          {
            key: '2',
            label: 'Screengrabs',
            children: <ScreengrabsTable />,
          },
        ]}
      />
    </ContainerPage>
  );
}
