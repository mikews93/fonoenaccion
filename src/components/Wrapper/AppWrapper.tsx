import { ReactNode } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

interface AppWrapperProps {
	children: ReactNode;
	className?: string;
	idName?: string;
	background?: 'white' | 'regular';
}

const AppWrapper = ({
	className = '',
	children,
	idName,
	background = 'white',
}: AppWrapperProps) => {
	/**
	 * hooks
	 */
	const [{ theme }] = useSharedDataContext();

	return (
		<div
			id={idName}
			className={`${styles.wrapper} ${className} container`}
			style={{
				background: background === 'white' ? theme?.colorBgBase : theme?.colorBgLayout,
				color: theme?.colorTextBase,
			}}
		>
			{children}
		</div>
	);
};
export default AppWrapper;
