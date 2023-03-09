import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ROUTES } from 'shared/routes';
import { isUserAuthenticated } from 'shared/utils/Auth';

const NotFound = () => {
  /**
   * hooks
   */
  const navigate = useNavigate();

  /**
   * Callbacks
   */
  const handleBackHome = () => {
    navigate(isUserAuthenticated() ? APP_ROUTES.SPIELS : ROUTES.HOME);
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
