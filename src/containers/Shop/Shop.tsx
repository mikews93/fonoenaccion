import { Avatar, Button, Card, Typography } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';
import Meta from 'antd/es/card/Meta';

// @components
import MotionWrap from 'components/Wrapper/MotionWrapper';
import { Paypal } from 'components/Paypal/Paypal';

// @utils
import { translate } from 'shared/internationalization/translate';
import { getWhatsappMessageMeURL } from 'shared/utils/SocialMedia';

// @styles
import styles from './styles.module.scss';

export default function Shop() {
	/**
	 * handlers
	 */
	const handleClickSendPaymentProof = () => {
		return window.open(
			getWhatsappMessageMeURL(
				'573236236284',
				`Hola! mi nombre es *(Reemplaza este texto con tu nombre completo)* acabo de hacer el pago del curso para evaluacion e intervención en autismo y adjunto el comprobate de pago *(adjunta el comprobate de tu pago en este mensaje)*`
			)
		);
	};

	/**
	 * Courses
	 */
	const products = [
		{
			key: 'autism',
			cover: '/images/autismCourse/overview.png',
			seller: '/images/startBanner.jpeg',
			title: 'autism_course_title',
			type: translate('course'),
			actions: [
				<Paypal />,
				<Button
					shape='round'
					size='large'
					icon={<WhatsAppOutlined />}
					onClick={handleClickSendPaymentProof}
				>{`${capitalize(translate('send_payment_proof'))}`}</Button>,
			],
			characteristics: [
				`${capitalize(translate('autism_formation'))}`,
				`${capitalize(translate('course_lenght', { hours: 6 }))}`,
				`${capitalize(translate('ebook_memorias'))}`,
				`${capitalize(translate('recording_availability', { days: 8 }))}`,
			],
		},
	];

	return (
		<div className={styles.shop}>
			<div className={styles.banner}>
				<video src='/assets/shopping.mp4' autoPlay muted loop />
				<Typography.Title className={styles.title}>{`${capitalize(
					translate('shop')
				)}`}</Typography.Title>
			</div>
			<MotionWrap className={styles.content}>
				{products.map((product) => (
					<Card
						key={product.key}
						className={styles.productItem}
						cover={<img alt='cover' width={300} src={product.cover} />}
						actions={product.actions}
					>
						<Meta
							avatar={<Avatar src={product.seller} />}
							title={`${capitalize(translate(product.title))}`}
							description={
								<>
									{`${capitalize(
										translate('included_with_product', { product_type: product.type })
									)}`}
									<ul>
										{product.characteristics.map((characteristic, index) => (
											<li key={index}>{characteristic}</li>
										))}
									</ul>
								</>
							}
						/>
					</Card>
				))}
			</MotionWrap>
		</div>
	);
}
