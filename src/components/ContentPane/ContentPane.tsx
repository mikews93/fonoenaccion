import classNames from 'classnames';
import {
  ActionableHeader,
  ActionableHeaderProps,
} from 'components/ActionableHeader/ActionableHeader';
import { GeneralLoading } from 'components/GeneralLoading/GeneralLoading';
import { FC, ReactNode, Suspense } from 'react';

// @styles
import styles from './styles.module.scss';

interface ContainerPageProps extends Omit<ActionableHeaderProps, 'Content'> {
  title?: ReactNode;
  subTitle?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
}

export const ContentPane: FC<ContainerPageProps> = ({
  children,
  title,
  subTitle,
  extra,
  className,
  ...props
}) => {
  return (
    <div className={classNames(className, styles.contentPane)}>
      {title && (
        <ActionableHeader
          className={styles.header}
          content={
            <div className={styles.headerText}>
              <div className={classNames('truncate-text', styles.title)}>{title}</div>
              <div className={styles.subtitle}>{subTitle}</div>
            </div>
          }
          extra={extra}
          {...props}
        />
      )}
      <div className={styles.body}>
        <Suspense fallback={<GeneralLoading />}>{children}</Suspense>
      </div>
    </div>
  );
};
