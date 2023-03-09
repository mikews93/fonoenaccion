import { Typography } from 'antd';
import { FC, ReactNode } from 'react';

// @styles
import styles from './styles.module.scss';

interface ConfigItemProps {
  title: ReactNode;
  subTitle?: string;
  extra?: ReactNode;
  children?: ReactNode;
}

export const ConfigItem: FC<ConfigItemProps> = ({ title, subTitle, extra, children }) => {
  return (
    <div className={styles.configItem}>
      <div className={styles.header}>
        <div className={styles.titles}>
          <Typography.Title level={5}>{title}</Typography.Title>
          <Typography.Text className={styles.subTitle}>{subTitle}</Typography.Text>
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
};
