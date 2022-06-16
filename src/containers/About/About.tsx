// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

const About = () => {
	return (
		<AppWrapper idName='about' classNames='whitebg'>
			<MotionWrap classNames={`${styles.about}`}>
				<div id='about' className={styles.about}>
					<h2 className='head-text'>
						{`${translate('beginning')}`} <span>{`${translate('goodness')}`}</span> <br />
						Esperalo....
					</h2>
				</div>
			</MotionWrap>
		</AppWrapper>
	);
};

export default About;
