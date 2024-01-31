import { Tooltip } from 'antd';

// @utils
import { getWhatsappMessageMeURL } from 'shared/utils/SocialMedia';

// @styles
import styles from './styles.module.scss';
import { translate } from 'shared/internationalization/translate';

type SocialMediaType = {
	name: string;
	link: string;
	icon: string;
	tooltip: string;
};

const SocialMedia = () => {
	const socialMedia: SocialMediaType[] = [
		{
			icon: '/images/whatsapp.svg',
			link: getWhatsappMessageMeURL(),
			name: 'Whatsapp',
			tooltip: translate('contactMe', { platform: 'WhatsApp' }),
		},
		{
			icon: '/images/telegram.svg',
			link: 'https://t.me/+brjc6PpkJKExOTgx',
			name: 'Telegram',
			tooltip: translate('joinMe', { platform: 'Telegram' }),
		},
		{
			icon: '/images/instagram.svg',
			link: 'https://www.instagram.com/fonoenaccion',
			name: 'Instagram',
			tooltip: translate('followMe', { platform: 'Instagram' }),
		},
		{
			icon: '/images/linkedIn.svg',
			link: 'https://www.linkedin.com/in/fono-en-accion-82568928b/',
			name: 'LinkedIn',
			tooltip: translate('contactMe', { platform: 'LinkedIn' }),
		},
		{
			icon: '/images/youtube.svg',
			link: 'https://www.youtube.com/@fonoenaccion1887',
			name: 'YouTube',
			tooltip: translate('watchMe', { platform: 'YouTube' }),
		},
	];

	/**
	 * handlers
	 */
	const handleClick = (url: string) => {
		window.open(url, '_blank');
	};

	return (
		<div className={styles.social}>
			{socialMedia.map((media, index) => (
				<div key={index} onClick={() => handleClick(media.link)}>
					<Tooltip title={media.tooltip} placement='right'>
						<img src={media.icon} alt={media.tooltip} />
					</Tooltip>
				</div>
			))}
		</div>
	);
};

export default SocialMedia;
