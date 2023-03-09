import { Button, Menu, MenuProps, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { capitalize } from 'lodash';
import SVG from 'react-inlinesvg';

// @assets
import BrandIcon from '/images/isotipo.svg';

// @constants
import { PUBLIC_ROUTES } from 'shared/routes';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

export const NavbarHeader = () => {
	/**
	 * Conditional rendering
	 */
	let items: MenuProps['items'] = Object.entries(PUBLIC_ROUTES).map(([key, route]) => ({
		key: route,
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
					defaultSelectedKeys={[PUBLIC_ROUTES.START]}
					items={items}
					overflowedIndicator={<MenuOutlined />}
				/>
			</div>
		</div>
	);
};
