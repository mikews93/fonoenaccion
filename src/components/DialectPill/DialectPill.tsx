import { FC } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { Button, Space } from 'antd';

// @utils
import { getCountryFlag } from 'shared/utils/Icons';

// @styles
import styles from './styles.module.scss';

interface DialectPillProps {
  dialect?: string;
  all?: boolean;
}

export const DialectPill: FC<DialectPillProps> = ({ dialect, all }) => {
  /**
   * Callbacks
   */
  const getFlagIcon = () => {
    if (isEmpty(dialect)) {
      return null;
    }

    const [_, countryCode] = dialect?.split('-') || [];

    return getCountryFlag(countryCode);
  };

  return (
    <Button className={classNames(styles.dialectPill, { [styles.all]: all })} type='text'>
      {all ? (
        <span>{dialect || 'All'}</span>
      ) : (
        <Space>
          {getFlagIcon()}
          {dialect}
        </Space>
      )}
    </Button>
  );
};
