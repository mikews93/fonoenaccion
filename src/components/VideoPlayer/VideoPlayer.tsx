import { CloseCircleTwoTone } from '@ant-design/icons';
import { Modal, ModalProps } from 'antd';
import { FC } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

interface VideoPlayerProps extends ReactPlayerProps {
	title?: ModalProps['title'];
	open: ModalProps['open'];
	onClose?: ModalProps['onCancel'];
}

export const VideoPlayer: FC<VideoPlayerProps> = ({ open, onClose, title, ...props }) => {
	const [sharedData] = useSharedDataContext();

	return (
		<Modal
			centered
			className={styles.videoPlayer}
			closeIcon={
				<CloseCircleTwoTone
					twoToneColor={sharedData.theme?.colorPrimary}
					className={styles.closeIcon}
				/>
			}
			destroyOnClose
			footer={null}
			onCancel={onClose}
			title={title}
			open={open}
		>
			<ReactPlayer controls width='100%' height='100%' {...props} />
		</Modal>
	);
};
