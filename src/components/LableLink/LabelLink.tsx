import { ExportOutlined } from '@ant-design/icons';
import { FC, ReactNode } from 'react';

// @styles
import styles from './styles.module.scss';

interface LabelLinkProps {
  children: ReactNode;
}

export const LabelLink: FC<LabelLinkProps> = ({ children }) => {
  /**
   * handlers
   */
  const handleOpenLink = () => {
    if (typeof children === 'string') {
      return open(children);
    }
  };

  return (
    <div className={styles.labelLink}>
      {children}
      <ExportOutlined className={styles.icon} onClick={handleOpenLink} title='Open link' />
    </div>
  );
};
