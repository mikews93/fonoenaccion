import { FC } from 'react';
import { Progress, ProgressProps } from 'antd';
import classNames from 'classnames';

// @styles
import styles from './styles.module.scss';
import { useSharedDataContext } from 'shared/context/useSharedData';

export const GlobalMutationProgress: FC<ProgressProps> = ({
  status = 'active',
  showInfo = false,
  size = 'small',
  className,
  ...props
}) => {
  /**
   * hooks
   */
  const [sharedData] = useSharedDataContext();
  return (
    <Progress
      {...props}
      className={classNames(styles.mutationProgress, className, {
        [styles.visible]: !!sharedData.mutationPercentage,
      })}
      percent={sharedData.mutationPercentage}
    />
  );
};
