// @styles
import { ReactNode } from 'react';
// import { FcIdea } from 'react-icons/fc';
import { RiUserVoiceLine } from 'react-icons/ri';
// import { FaAssistiveListeningSystems } from 'react-icons/fa';
import { TbTriangleSquareCircle } from 'react-icons/tb';
import { TbLanguage } from 'react-icons/tb';
// import { GiFruitBowl } from 'react-icons/gi';

import {
	CalendarOutlined,
	EnvironmentOutlined,
	MenuOutlined,
	SearchOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Form, Image, Menu, MenuProps, Select, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import classNames from 'classnames';

// @components
import { AppointmentItem } from 'components/AppointmentItem/AppointmentItem';
import { Testimonials } from 'components/Testimonials/Testimonials';
import { MapLocation } from 'components/MapLocation/MapLocation';
import SocialMedia from 'components/SocialMedia/SocialMedia';
import MotionWrap from 'components/Wrapper/MotionWrapper';
import { Services } from 'components/Services/Services';
import AppWrapper from 'components/Wrapper/AppWrapper';
import { Appointment } from 'shared/types/Apointment';
import { About } from 'components/About/About';

// @utils
import { translate } from 'shared/internationalization/translate';

// @constants
import { PARTIAL_SERVICES } from 'shared/constants';

// @styles
import styles from './styles.module.scss';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { getWhatsappMessageMeURL } from 'shared/utils/SocialMedia';
// import { formatDate } from 'shared/utils/Date';
import moment from 'moment';
import { useScreen } from 'shared/hooks/useScreen';

const iconsMapper: { [key in PARTIAL_SERVICES]: ReactNode } = {
	[PARTIAL_SERVICES.general]: <TbTriangleSquareCircle />,
	// [PARTIAL_SERVICES.swallowing]: <GiFruitBowl />,
	// [PARTIAL_SERVICES.learning]: <FcIdea />,
	[PARTIAL_SERVICES.speech_therapy]: <RiUserVoiceLine />,
	// [PARTIAL_SERVICES.hearing]: <FaAssistiveListeningSystems />,
	[PARTIAL_SERVICES.language]: <TbLanguage />,
};

const logosMapper = [
	'/images/anneMed.png',
	'/images/formexMedical.png',
	'/images/jonsonMedical.gif',
	'/images/meridianMedical.gif',
	'/images/optimalMedical.png',
];

const initialValues: Appointment = {
	serviceType: PARTIAL_SERVICES.general,
	location: 'Envigado/Antioquia',
	appointmentDate: '',
	who: 1,
};

const Start = () => {
	/**
	 * Hooks
	 */
	const { width } = useScreen();
	const [form] = useForm<Appointment>();

	/**
	 * Handlers
	 */
	const handleSelectService: MenuProps['onSelect'] = ({ key }) =>
		form.setFieldValue('serviceType', key);
	const handleSubmit = (values: Appointment) => {
		const url = getWhatsappMessageMeURL(
			undefined,
			translate('appointment_wp_message', {
				...values,
				serviceType: `${translate(values.serviceType)}`,
				appointmentDate: moment(values.appointmentDate).format('DD/MM/YYYY'),
			})
		);
		return window.open(url, '_blank');
	};

	/**
	 * Conditional rendering
	 */
	const menuItems: MenuProps['items'] = Object.entries(PARTIAL_SERVICES).map(([key, label]) => ({
		key: label,
		label: `${translate(key)}`,
		icon: iconsMapper[key as PARTIAL_SERVICES],
	}));
	return (
		<>
			<AppWrapper idName='home'>
				<MotionWrap className={`${styles.start}`}>
					<div className={styles.description}>
						<Typography.Title>{`${translate('start_title')}`}</Typography.Title>
						<Typography.Text>{`${translate('start_text')}`}</Typography.Text>
					</div>
					<div className={styles.rightSideImage}>
						<Image
							className={styles.rightSideImage}
							src='images/startBanner.jpeg'
							preview={false}
						/>
					</div>
					<Form
						form={form}
						initialValues={initialValues}
						layout={width < 1300 ? 'vertical' : 'inline'}
						onFinish={handleSubmit}
						className={styles.appointment}
					>
						<Form.Item name='serviceType'>
							<div className={styles.header}>
								<Typography.Title level={3}>{`${translate('book_appointment')}`}</Typography.Title>
								<Menu
									className={styles.servicesMenu}
									mode='horizontal'
									items={menuItems}
									defaultSelectedKeys={[PARTIAL_SERVICES.general]}
									onSelect={handleSelectService}
									overflowedIndicator={<MenuOutlined />}
								/>
							</div>
						</Form.Item>
						<div className={classNames(styles.scheduleAppointment)}>
							<Form.Item name='location'>
								<AppointmentItem icon={<EnvironmentOutlined />} name='location' />
							</Form.Item>
							<Form.Item
								name='appointmentDate'
								rules={[{ required: true, message: translate('required_field') }]}
							>
								<AppointmentItem
									icon={<CalendarOutlined />}
									type='secondary'
									name='appointmentDate'
								>
									<DatePicker />
								</AppointmentItem>
							</Form.Item>
							<Form.Item name='who'>
								<AppointmentItem icon={<UserOutlined />} type='secondary' name='who'>
									<Select
										options={[
											{ value: 1, label: `1 ${translate('child', { count: 1 })}` },
											{ value: 2, label: `2 ${translate('child', { count: 2 })}` },
										]}
									/>
								</AppointmentItem>
							</Form.Item>

							<Button type='primary' icon={<SearchOutlined />} size='large' htmlType='submit'>
								{`${translate('search')}`}
							</Button>
						</div>
					</Form>
					<div className={styles.brands}>
						{logosMapper.map((src, index) => (
							<Image key={index} src={src} width='200px' preview={false} />
						))}
					</div>
				</MotionWrap>
			</AppWrapper>
			<About />
			<Services />
			<Testimonials />
			<MapLocation />
			<SocialMedia />
		</>
	);
};

export default Start;
