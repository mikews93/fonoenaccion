import { Image, ImageProps } from 'antd';
import { FC } from 'react';

// @styles
import styles from './styles.module.scss';

export const CustomIcon: FC<ImageProps> = ({ preview = false, ...props }) => {
  return (
    <Image {...props} className={styles.customIcon} preview={preview}>
      CustomIcon
    </Image>
  );
};
