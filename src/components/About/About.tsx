import { Typography } from 'antd';
import { motion } from 'framer-motion';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

export const About = () => {
	return (
		<AppWrapper idName='about' background='regular'>
			<MotionWrap className={`${styles.about}`}>
				<div className={styles.content}>
					<Typography.Title className={styles.title}>{`${translate('about')}`}</Typography.Title>
					<Typography.Text className={styles.description}>{`${translate(
						'aboutMessage'
					)}`}</Typography.Text>
				</div>
				<div className={styles.rightPane} />
			</MotionWrap>
		</AppWrapper>
	);
};
