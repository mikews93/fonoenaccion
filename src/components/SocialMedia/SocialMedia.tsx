import { Tooltip } from 'antd';

// @hooks
import { useRequest } from 'shared/hooks/useRequest';

// @client
import { urlFor } from 'shared/sanity/client';

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
	const [socialMedia] = useRequest<SocialMediaType[]>({
		path: '*[_type == "socialMedia"]',
		options: { isSanity: true },
	});

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
						<img src={urlFor(media.icon)} alt={media.tooltip} />
					</Tooltip>
				</div>
			))}
		</div>
	);
};

export default SocialMedia;
