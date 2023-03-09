import { Button, Checkbox, Form, Input, Layout, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// @styles
import styles from './styles.module.scss';
import { ROUTES } from 'shared/routes';

// @hooks
import { useLogin } from './services/useLogin';
import { useNotifications } from 'shared/hooks/useNotifications';

// @components
import { Copyright } from 'components/Copyright/Copyright';

// @constants
import { REQUEST_STATUS_CODES } from 'shared/constants';

const { Content, Footer } = Layout;

const Login = () => {
  /**
   * queries
   */
  const [login, { isLoginIn }] = useLogin();

  /**
   * Hooks
   */
  const location = useLocation();
  const navigate = useNavigate();
  const { errorNotification } = useNotifications();
  // @ts-ignore
  const { from } = location.state || { from: { pathname: ROUTES.HOME } };

  /**
   * Callbacks
   */
  const handleLogin = async (values: any) => {
    const { error } = await login(values);
    if (error) {
      let errorMessage = 'Something went wrong';
      if (error.response?.status === REQUEST_STATUS_CODES.UNAUTHORIZED) {
        errorMessage = 'Invalid email or password';
      }
      return errorNotification('Oops!', errorMessage, { error });
    }
    navigate(from.pathname);
  };

  return (
    <Layout className={styles.login}>
      <Content className='flex-column justify-center center'>
        <Typography.Title level={3}>Login</Typography.Title>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item
            name='username'
            rules={[{ required: true, message: 'Please type your Username!' }]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Username'
              autoComplete='username'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please type your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
              autoComplete='current-password'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className='login-form-forgot' href=''>
              Forgot password
            </a>
          </Form.Item>

          <Form.Item className='flex justify-center'>
            <Button
              type='primary'
              htmlType='submit'
              className='full-width'
              shape='round'
              loading={isLoginIn}
            >
              Log in
            </Button>
            <span className={styles.registerSection}>
              Or <Link to={ROUTES.REGISTER}>register now!</Link>
            </span>
          </Form.Item>
        </Form>
      </Content>
      <Footer className='center justify-center'>
        <Copyright />
      </Footer>
    </Layout>
  );
};

export default Login;
