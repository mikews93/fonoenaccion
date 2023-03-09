import classNames from 'classnames';
import { FC } from 'react';

// @constants
import { INSTANCE_STATUS } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

interface DotBadgeProps {
  status?: INSTANCE_STATUS;
}

export const DotBadge: FC<DotBadgeProps> = ({ status = INSTANCE_STATUS.INSTANCE_DEREGISTERED }) => (
  <div className={classNames(styles.dotBadge, styles[status])} />
);
