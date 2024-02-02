import { Typography } from 'antd';
import { capitalize } from 'lodash';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
// import { FcIdea } from 'react-icons/fc';
import { RiUserVoiceLine } from 'react-icons/ri';
// import { FaAssistiveListeningSystems } from 'react-icons/fa';
import { TbTriangleSquareCircle } from 'react-icons/tb';
import { TbLanguage } from 'react-icons/tb';
// import { GiFruitBowl } from 'react-icons/gi';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @constants
import { PARTIAL_SERVICES } from 'shared/constants';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

type ServiceItem = {
	title: string;
	description: string;
	icon: ReactNode;
};

const servicesMapper: Record<PARTIAL_SERVICES, ServiceItem> = {
	[PARTIAL_SERVICES.general]: {
		title: capitalize(translate(PARTIAL_SERVICES.general)),
		description: capitalize(translate('general_assessment_description')),
		icon: <TbTriangleSquareCircle />,
	},
	// [PARTIAL_SERVICES.swallowing]: {
	// 	title: capitalize(translate(PARTIAL_SERVICES.swallowing)),
	// 	description: capitalize(translate('swallowing_assessment_description')),
	// 	icon: <GiFruitBowl />,
	// },
	// [PARTIAL_SERVICES.learning]: {
	// 	title: capitalize(translate(PARTIAL_SERVICES.learning)),
	// 	description: capitalize(translate('learning_assessment_description')),
	// 	icon: <FcIdea className={styles.noFilter} />,
	// },
	[PARTIAL_SERVICES.speech_therapy]: {
		title: capitalize(translate(PARTIAL_SERVICES.speech_therapy)),
		description: capitalize(translate('speech_therapy_assessment_description')),
		icon: <RiUserVoiceLine />,
	},
	// [PARTIAL_SERVICES.hearing]: {
	// 	title: capitalize(translate(PARTIAL_SERVICES.hearing)),
	// 	description: capitalize(translate('hearing_assessment_description')),
	// 	icon: <FaAssistiveListeningSystems />,
	// },
	[PARTIAL_SERVICES.language]: {
		title: capitalize(translate(PARTIAL_SERVICES.language)),
		description: capitalize(translate('language_assessment_description')),
		icon: <TbLanguage />,
	},
};

export const Services = () => {
	return (
		<AppWrapper idName='testimonials'>
			<MotionWrap className={`${styles.services}`}>
				<motion.div
					whileInView={{ opacity: [0, 1] }}
					transition={{ duration: 0.5, delayChildren: 0.5 }}
					className={styles.header}
				>
					<Typography.Title className={styles.title}>
						{capitalize(`${translate('our', { count: 2 })} ${translate('services')}`)}
					</Typography.Title>
					<Typography.Text className={styles.subTitle}>{`${capitalize(
						translate('services_subtitle')
					)}`}</Typography.Text>
				</motion.div>
				<motion.div
					whileInView={{ opacity: [0, 1] }}
					transition={{ duration: 0.5, delayChildren: 0.5 }}
					className={styles.layout}
				>
					{Object.values(servicesMapper).map(({ title, description, icon }, index) => {
						return (
							<motion.div
								whileInView={{ opacity: [0, 1] }}
								transition={{ duration: 0.5, delayChildren: 0.5 }}
								className={styles.serviceItem}
								key={index}
							>
								<div className={styles.icon}>{icon}</div>
								<Typography.Title level={3} className={styles.serviceTitle}>
									{title}
								</Typography.Title>
								<Typography.Text className={styles.serviceDescription}>
									{description}
								</Typography.Text>
							</motion.div>
						);
					})}
				</motion.div>
			</MotionWrap>
		</AppWrapper>
	);
};
