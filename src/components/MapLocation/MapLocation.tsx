import { EnvironmentOutlined } from '@ant-design/icons';
import GoogleMapReact from 'google-map-react';
import ReactPlayer from 'react-player';
import { Image, Typography } from 'antd';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @utils
import { currentLanguage, translate } from 'shared/internationalization/translate';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

const Marker = ({ lat, lng }: { lat: number; lng: number }) => (
	// @ts-ignore:
	<div className={styles.marker} lat={lat} lng={lng}>
		<Image src='/images/logo.svg' preview={false} className={styles.logo} />
	</div>
);

export const MapLocation = () => {
	/**
	 * Hooks
	 */
	const [
		{
			settings: { mapsApiKey = '' },
		},
	] = useSharedDataContext();

	return (
		<AppWrapper idName='mapLocation'>
			<MotionWrap className={`${styles.mapLocation}`}>
				<Typography.Title className={styles.title}>{`${translate(
					'whereToFindUs'
				)}`}</Typography.Title>
				<div className={styles.layout}>
					<div className={styles.mapLayout}>
						<GoogleMapReact
							layerTypes={['TransitLayer']}
							defaultCenter={{ lat: 6.1676376738558565, lng: -75.58742371808198 }}
							bootstrapURLKeys={{ key: mapsApiKey, language: currentLanguage }}
							zoom={15}
						>
							<Marker lat={6.1676376738558565} lng={-75.58742371808198} />
						</GoogleMapReact>
					</div>
					<div className={styles.videoLayout}>
						<Typography.Title level={3} className={styles.videoTitle}>
							{`${translate('howToGetHere')}`}
						</Typography.Title>
						<ReactPlayer
							stopOnUnmount
							width='100%'
							loop
							muted
							url='https://www.youtube.com/shorts/VM54XihgL7Q'
						/>
						<span className={styles.address}>
							<EnvironmentOutlined />
							<Typography.Text>
								{/* TODO: this should come from database */}
								{`${translate('currentAddress')}`}
							</Typography.Text>
						</span>
					</div>
				</div>
			</MotionWrap>
		</AppWrapper>
	);
};
