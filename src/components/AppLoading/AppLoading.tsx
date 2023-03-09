import SVG from 'react-inlinesvg';

// @assets
import BrandIcon from '/images/isotipo.svg';

// @styles
import './styles.scss';

export const AppLoading = ({ isCentered = true }: { isCentered?: boolean }) => {
	return (
		<div className={isCentered ? 'absolute-center' : ''}>
			<SVG src={BrandIcon} />
		</div>
	);
};
