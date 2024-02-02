import { EnvironmentOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @utils
import { translate } from 'shared/internationalization/translate';

// @styles
import styles from './styles.module.scss';

export const MapLocation = () => (
	<AppWrapper idName='mapLocation'>
		<MotionWrap className={`${styles.mapLocation}`}>
			<Typography.Title className={styles.title}>{`${translate(
				'whereToFindUs'
			)}`}</Typography.Title>
			<div className={styles.layout}>
				<div className={styles.mapLayout}>
					<iframe
						src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247.92035122414558!2d-75.58753731547735!3d6.167485371607514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4683114547b893%3A0x834f6ebcf543958a!2sfono%20en%20accion!5e0!3m2!1ses-419!2sco!4v1706657455669!5m2!1ses-419!2sco'
						width='100%'
						height='100%'
						style={{ border: 0 }}
						loading='lazy'
					/>
				</div>
				<div className={styles.videoLayout}>
					<Typography.Title level={3} className={styles.videoTitle}>
						{`${translate('howToGetHere')}`}
						{/* {`${translate('our_office')}`} */}
					</Typography.Title>
					<video width='100%' autoPlay loop muted src='/assets/howToArrive.mp4' />
					<span className={styles.address}>
						<EnvironmentOutlined />
						<Typography.Text>{`${translate('currentAddress')}`}</Typography.Text>
					</span>
				</div>
			</div>
		</MotionWrap>
	</AppWrapper>
);
