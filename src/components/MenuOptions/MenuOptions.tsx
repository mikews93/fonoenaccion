import { AlignLeftOutlined, FolderOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Menu } from 'antd';
import { startCase } from 'lodash';

// @types
import { MenuSectionProps } from 'components/Sidebar/Sidebar';

// @routes
import { APP_ROUTES, HOME_ROUTES } from 'shared/routes';

// @hooks
import { useCurrentPath } from 'shared/utils/Route';

// @components
import { OrganizationalAdmin } from 'components/OrganizationalAdmin/OrganizationalAdmin';
import { ProjectAdmin } from 'components/ProjectAdmin/ProjectAdmin';
import { VideoUsage } from 'components/VideoUsage/VideoUsage';
import { Instances } from 'components/Instances/Instances';

// @utils
import { getItem, MenuItem } from 'shared/utils/MenuItem';

// @styles
import styles from './styles.module.scss';

const filteredAppRoutes = Object.entries(APP_ROUTES).filter(
  ([key]) => !key.includes('DETAILS') && !key.includes('NEW')
);
const homeRoutes = Object.entries(HOME_ROUTES);

const defaultSelected = [...filteredAppRoutes].shift()?.[0] || '';

export const MenuOptions: FC<MenuSectionProps> = ({ collapsed }) => {
  /**
   * State
   */
  const [selectedKey, setSelectedKey] = useState<string>(defaultSelected.toLowerCase());

  /**
   * hooks
   */
  const getPath = useCurrentPath(homeRoutes.map(([_, basepath]) => ({ path: basepath })));

  /**
   * Callbacks
   */
  const getSelectedKey = () => {
    const currentPath = getPath();
    const findKey = homeRoutes.find(([_, value]) => value === currentPath)?.[0];

    setSelectedKey(findKey?.toLowerCase() || '0');
  };

  const getMenuIcon = (item: string): ReactNode => {
    switch (item) {
      case 'videos':
        return <VideoCameraOutlined />;
      case 'playlists':
        return <AlignLeftOutlined />;
      default:
        return <FolderOutlined />;
    }
  };

  const items: MenuItem[] = [
    ...filteredAppRoutes.map(([key, to]) => {
      const routeName = key.toLowerCase();
      return getItem({
        label: (
          <Link className={styles.menuLink} to={to}>
            {startCase(routeName)}
          </Link>
        ),
        key: routeName,
        icon: getMenuIcon(routeName),
      });
    }),
    { type: 'divider' },
    VideoUsage(),
    { type: 'divider' },
    Instances(collapsed),
    { type: 'divider' },
    ...ProjectAdmin({ collapsed, grouped: false }),
    { type: 'divider' },
    ...OrganizationalAdmin({ collapsed, grouped: false }),
  ];

  /**
   * Effects
   */
  useEffect(() => {
    getSelectedKey();
  }, [getSelectedKey]);

  return (
    <div className={classNames(styles.menuOptions, { [styles.normalized]: !collapsed })}>
      <Menu
        defaultSelectedKeys={[defaultSelected]}
        selectedKeys={[selectedKey]}
        mode='inline'
        items={items}
        defaultOpenKeys={['ProjectAdmin', 'Instances', 'OrganizationalAdmin']}
      />
    </div>
  );
};
