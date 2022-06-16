import { lazy, Suspense } from 'react';

// @components
import GeneralLoading from 'components/GeneralLoading/GeneralLoading';
// import SocialMedia from 'components/SocialMedia/SocialMedia';

// @styles
import styles from './styles.module.scss';

// @utils
import { translate } from 'shared/internationalization/translate';

const About = lazy(() => import('containers/About/About'));

export const Home = () => {
	return (
		<div className={styles.portfolio}>
			<Suspense fallback={<GeneralLoading />}>
				<About />
				{/* <SocialMedia /> */}
				<div className='copyright whitebg'>
					<p className='p-text'>@{new Date().getFullYear()} Fono en accion</p>
					<p className='p-text'>{`${translate('all_rights_reserved')}`}</p>
				</div>
			</Suspense>
		</div>
	);
};
