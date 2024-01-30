import { Button, Menu, MenuProps, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import SVG from 'react-inlinesvg';
import { useEffect, useState } from 'react';

// @assets
import BrandIcon from '/images/isotipo.svg';

// @constants
import { PUBLIC_ROUTES } from 'shared/routes';

// @utils
import { translate } from 'shared/internationalization/translate';
import { useCurrentPath } from 'shared/utils/Route';

// @styles
import styles from './styles.module.scss';

const routes = Object.entries(PUBLIC_ROUTES);
const defaultSelected = [...routes].shift()?.[0] || '';

export const NavbarHeader = () => {
	/**
	 * State
	 */
	const [selectedKey, setSelectedKey] = useState<string>(defaultSelected.toLowerCase());

	/**
	 * Hooks
	 */
	const getPath = useCurrentPath(routes.map(([_, basepath]) => ({ path: basepath })));

	/**
	 * Callbacks
	 */
	const getSelectedKey = () => {
		const currentPath = getPath();
		const findKey = routes.find(([_, value]) => currentPath?.includes(value))?.[0];

		setSelectedKey(findKey?.toLowerCase() || '0');
	};

	/**
	 * Effects
	 */
	useEffect(() => {
		getSelectedKey();
	}, [getSelectedKey]);

	/**
	 * Conditional rendering
	 */
	let items: MenuProps['items'] = routes.map(([key, route]) => ({
		key: key.toLowerCase(),
		label: <Link to={route}>{capitalize(`${translate(key.toLowerCase())}`)}</Link>,
	}));
	items = [
		...items,
		{
			key: 'login',
			label: (
				<Button size='large' type='primary' className={styles.loginButton}>{`${translate(
					'login'
				)}`}</Button>
			),
		},
	];

	return (
		<div className={styles.navbarHeader}>
			<Link className={styles.logo} to={PUBLIC_ROUTES.START}>
				<SVG src={BrandIcon} />
				<Typography.Title level={3}>Fonoenacción</Typography.Title>
			</Link>
			<div className={styles.rightSection}>
				<Menu
					className={styles.menu}
					mode='horizontal'
					defaultSelectedKeys={[defaultSelected]}
					selectedKeys={[selectedKey]}
					items={items}
					overflowedIndicator={<MenuOutlined />}
				/>
			</div>
		</div>
	);
};
