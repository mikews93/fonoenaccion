// @components
import { PageHeaderProps } from '@ant-design/pro-layout';
import { CSSProperties, FC } from 'react';
import classNames from 'classnames';

// @components
import { ContainerHeader } from 'components/ContainerHeader/ContainerHeader';

// @styles
import styles from './styles.module.scss';

interface ContainerPageProps extends PageHeaderProps {
  children?: any;
  title?: string;
  contentMargin?: string;
  className?: string;
  contentStyle?: CSSProperties;
}

export const ContainerPage: FC<ContainerPageProps> = ({
  children,
  contentMargin = '1.5rem',
  className,
  contentStyle,
  ...headerProps
}) => {
  return (
    <div className={classNames(styles.containerPage, className)}>
      <ContainerHeader {...headerProps} />
      <div
        role='content'
        className={styles.content}
        style={{ padding: contentMargin, ...contentStyle }}
      >
        {children}
      </div>
    </div>
  );
};
