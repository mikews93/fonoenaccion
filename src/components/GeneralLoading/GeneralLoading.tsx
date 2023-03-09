import { AppLoading } from 'components/AppLoading/AppLoading';

export const GeneralLoading = ({ isCentered = true }: { isCentered?: boolean }) => {
	return (
		<div className={isCentered ? 'absolute-center' : ''}>
			<AppLoading />
		</div>
	);
};
