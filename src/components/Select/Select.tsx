import { Select as AntSelect, SelectProps } from 'antd';
import classNames from 'classnames';

// @styles
import styles from './styles.module.scss';

export const Option = AntSelect.Option;

export const Select = ({ children, className, ...props }: SelectProps) => {
  return (
    <AntSelect className={classNames(styles.select, className)} {...props}>
      {children}
    </AntSelect>
  );
};
