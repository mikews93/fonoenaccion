// @styles
import { ContainerOutlined, RetweetOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';

// @routes
import { ORGANIZATIONAL_ROUTES } from 'shared/routes';

// @utils
import { getItem } from 'shared/utils/MenuItem';

export const OrganizationalAdmin = ({ collapsed = false, grouped = false }) => {
  /**
   * Callbacks
   */
  const renderSubitems = () => {
    const icons: { [key in ORGANIZATIONAL_ROUTES]: JSX.Element } = {
      [ORGANIZATIONAL_ROUTES.REPLACEMENTS]: <RetweetOutlined />,
    };
    const routes = Object.entries(ORGANIZATIONAL_ROUTES);
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
          key: 'OrganizationalAdmin',
          label: 'Organizational admin',
          children: renderSubitems(),
          icon: !collapsed || <ContainerOutlined />,
        }),
      ]
    : [...renderSubitems()];
};
