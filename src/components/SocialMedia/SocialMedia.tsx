import { Tooltip } from 'antd';

// @hooks
// import { useRequest } from 'shared/hooks/useRequest';

// @client
// import { urlFor } from 'shared/sanity/client';

// @styles
import styles from './styles.module.scss';

type SocialMediaType = {
	name: string;
	link: string;
	icon: string;
	tooltip: string;
};

const SocialMedia = () => {
	/**
	 * Queries
	 */

	const socialMedia = [
		{
			_createdAt: '2022-06-10T18:36:21Z',
			_id: '2992fff7-498c-4561-a64c-e6ae5ae6fa75',
			_rev: 'sGrqvfP2mxJ5kXjUrkJzdX',
			_type: 'socialMedia',
			_updatedAt: '2022-06-10T19:04:47Z',
			icon: '',
			link: "https://api.whatsapp.com/send?phone=573007323102&text=Hello%20I%20saw%20you%20portfolio%20and%20i'm%20interested%20on%20you%20services",
			name: 'Whatsapp',
			tooltip: 'Contact me on WhatsApp',
		},
		{
			_createdAt: '2022-06-10T18:11:43Z',
			_id: '36771f07-85fd-4892-a39c-323c5f987543',
			_rev: 'sGrqvfP2mxJ5kXjUrkJFQR',
			_type: 'socialMedia',
			_updatedAt: '2022-06-10T18:56:56Z',
			icon: '',
			link: 'https://github.com/mikews93',
			name: 'GitHub',
			tooltip: 'Follow my work on GitHub',
		},
		{
			_createdAt: '2022-06-10T18:49:13Z',
			_id: '3a094f10-2e1a-4c09-8bd1-f34d5c237439',
			_rev: 'sGrqvfP2mxJ5kXjUrkJN7x',
			_type: 'socialMedia',
			_updatedAt: '2022-06-10T18:58:35Z',
			icon: '',
			link: 'https://www.linkedin.com/in/mikews935/',
			name: 'LinkedIn',
			tooltip: 'Contact me on LinkedIn',
		},
		{
			_createdAt: '2022-06-10T18:14:40Z',
			_id: 'c57adf93-abc4-418f-91e9-941a939f7b4b',
			_rev: 'sGrqvfP2mxJ5kXjUrkJVEp',
			_type: 'socialMedia',
			_updatedAt: '2022-06-10T18:59:45Z',
			icon: '',
			link: 'https://www.youtube.com/c/MiguelAntonioBlancoSalcedo',
			name: 'YouTube',
			tooltip: 'Watch my videos on YouTube',
		},
	];
	// const [socialMedia] = useRequest<SocialMediaType[]>({
	// 	path: '*[_type == "socialMedia"]',
	// 	options: { isSanity: true },
	// });

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
