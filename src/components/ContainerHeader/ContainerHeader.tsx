import { PageHeader, PageHeaderProps } from '@ant-design/pro-layout/es/components/PageHeader';
import { cloneElement, FC, isValidElement } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Tag } from 'antd';

// hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

const { Title } = Typography;

export const ContainerHeader: FC<PageHeaderProps> = ({ extra, onBack, title, ...props }) => {
  /**
   * hooks
   */
  const [{ user, theme }] = useSharedDataContext();

  return (
    <PageHeader
      {...props}
      onBack={onBack}
      extra={isValidElement(extra) ? cloneElement(extra, props) : extra}
      className={styles.containerHeader}
      title={<Title level={4}>{title}</Title>}
      tags={
        <Tag className={styles.tag}>
          <LockOutlined /> {user.info?.roles}
        </Tag>
      }
    />
  );
};
