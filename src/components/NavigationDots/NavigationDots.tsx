// @routes
import { PORTFOLIO_ROUTES } from 'shared/routes';

// @styles
import styles from './styles.module.scss';

const NavigationDots = ({ active }: { active: string }) => (
	<div className={styles.navigation}>
		{Object.keys(PORTFOLIO_ROUTES).map((item, index) => (
			<a
				href={`#${item.toLowerCase()}`}
				key={item + index}
				className={`${active === item.toLowerCase() ? 'secondary-bg' : ''} ${styles.navigationDot}`}
			/>
		))}
	</div>
);

export default NavigationDots;
