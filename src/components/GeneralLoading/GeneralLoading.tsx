import SVG from 'react-inlinesvg';

// @assets
import BrandIcon from './brand-icon.svg';

// @styles
import './styles.scss';

const GeneralLoading = ({ isCentered = true }: { isCentered?: boolean }) => {
	return (
		<div className={isCentered ? 'absolute-center' : ''}>
			<SVG src={BrandIcon} />
		</div>
	);
};

export default GeneralLoading;
