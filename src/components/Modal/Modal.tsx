import { Modal as AntModal, ModalProps } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';

// @styles
import styles from './styles.module.scss';

export const Modal: FC<ModalProps> = ({ className, ...props }) => {
  return <AntModal destroyOnClose className={classNames(className, styles.modal)} {...props} />;
};
