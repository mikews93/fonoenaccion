// @styles
import { AppstoreOutlined, ProjectOutlined, ToolOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';

// @routes
import { PROJECT_ROUTES } from 'shared/routes';

// @utils
import { getItem } from 'shared/utils/MenuItem';

export const ProjectAdmin = ({ collapsed = false, grouped = false }) => {
  /**
   * Callbacks
   */
  const renderSubitems = () => {
    const icons: { [key in PROJECT_ROUTES]: JSX.Element } = {
      [PROJECT_ROUTES.SETTINGS]: <ToolOutlined style={{ transform: 'rotate(270deg)' }} />,
      [PROJECT_ROUTES.ENVIRONMENTS]: <AppstoreOutlined />,
      [PROJECT_ROUTES.PROJECTS]: <></>,
    };
    const routes = Object.entries(PROJECT_ROUTES).filter(
      ([_, value]) => value !== PROJECT_ROUTES.PROJECTS
    );
    return routes.map(([key, route]) =>
      getItem({
        key: key.toLowerCase(),
        label: <Link to={route}>{capitalize(key)}</Link>,
        icon: icons[route],
      })
    );
  };

  return grouped
    ? [
        getItem({
          key: 'ProjectAdmin',
          label: 'Project admin',
          children: renderSubitems(),
          icon: !collapsed || <ProjectOutlined />,
        }),
      ]
    : [...renderSubitems()];
};
