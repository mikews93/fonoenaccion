import { useState } from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

// @routes
import { PORTFOLIO_ROUTES } from 'shared/routes';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

const Navbar = () => {
	/**
	 * state
	 */
	const [toggle, setToggle] = useState(false);

	/**
	 * Callbacks
	 */
	const handleClickMenu = () => setToggle(true);
	const handleCloseMenu = () => setToggle(false);

	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<a href='#me'>
					<img src='assets/logo.svg' alt='logo' />
				</a>
			</div>
			<ul className={styles.links}>
				{Object.keys(PORTFOLIO_ROUTES).map((key: string) => (
					<li key={`link-${key}`} className='p-text flex-column'>
						<div />
						<a href={`#${key.toLowerCase()}`}>{`${translate(key)}`}</a>
					</li>
				))}
			</ul>
			<div className={styles.navbarMenu}>
				<HiMenuAlt4 onClick={handleClickMenu} />

				{toggle && (
					<motion.div
						whileInView={{ x: [300, 0] }}
						transition={{ duration: 0.85, ease: 'easeOut' }}
					>
						<HiX onClick={handleCloseMenu} />
						<ul>
							{Object.keys(PORTFOLIO_ROUTES).map((key: string) => (
								<li key={key}>
									<a href={`#${key.toLowerCase()}`} onClick={handleCloseMenu}>
										{`${translate(key)}`}
									</a>
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
