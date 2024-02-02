import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from 'shared/routes';

const NotFound = () => {
	/**
	 * hooks
	 */
	const navigate = useNavigate();

	/**
	 * Callbacks
	 */
	const handleBackHome = () => {
		navigate(PUBLIC_ROUTES.START);
	};

	return (
		<Result
			className='absolute-center'
			status='404'
			title='404'
			subTitle='Sorry, the page you visited does not exist.'
			extra={
				<Button type='primary' onClick={handleBackHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default NotFound;
