import { Tooltip } from 'antd';

// @utils
import { getWhatsappMessageMeURL } from 'shared/utils/SocialMedia';

// @styles
import styles from './styles.module.scss';

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
			tooltip: 'Contact me on WhatsApp',
		},
		{
			icon: '/images/instagram.svg',
			link: 'https://www.instagram.com/fonoenaccion',
			name: 'instagram',
			tooltip: 'Follow my work on Instagram',
		},
		{
			icon: '/images/linkedIn.svg',
			link: 'https://www.linkedin.com/in/fono-en-accion-82568928b/',
			name: 'LinkedIn',
			tooltip: 'Contact me on LinkedIn',
		},
		{
			icon: '/images/youtube.svg',
			link: 'https://www.youtube.com/@fonoenaccion1887',
			name: 'YouTube',
			tooltip: 'Watch my videos on YouTube',
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
