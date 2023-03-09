import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, screen } from '@testing-library/react';
import { APP_ROUTES, ROUTES } from 'shared/routes';
import { renderWithRouterAndContext } from 'shared/utils/Jest';
import Login from './Login';
import * as useLogin from './services/useLogin';
import * as useNotification from 'shared/hooks/useNotifications';

const loginMock = jest
  .fn()
  .mockImplementation((args: useLogin.LoginRequest) => ({ error: null, data: {} }));
const mockedNavigator = jest.fn();
const mockedLocation = jest.fn().mockImplementation(() => ({ state: { from: APP_ROUTES.SPIELS } }));
const mockErrorNotification = jest.fn();

jest
  .spyOn(useLogin, 'useLogin')
  .mockImplementation(() => [loginMock, { isLoginIn: false, error: null }]);

jest.spyOn(useNotification, 'useNotifications').mockImplementation(() => ({
  errorNotification: () => mockErrorNotification,
}));

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedNavigator,
  useLocation: () => mockedLocation,
}));

describe('Login page', () => {
  beforeEach(() => {
    loginMock.mockClear();
    mockedNavigator.mockClear();
    mockedLocation.mockClear();
  });

  it('should render component without problems', () => {
    renderWithRouterAndContext(<Login />);

    expect(screen.getByText('Login')).toBeDefined();
    expect(screen.getByPlaceholderText('Username')).toBeDefined();
    expect(screen.getByPlaceholderText('Password')).toBeDefined();
    expect(screen.getByText('Log in')).toBeDefined();

    expect(loginMock.mock.calls).toHaveLength(0);
  });

  it('should show errors when user does not type username or password', async () => {
    renderWithRouterAndContext(<Login />);

    const loginBtn = screen.getByText('Log in');

    await act(async () => {
      await fireEvent.click(loginBtn);
    });
    expect(loginMock.mock.calls).toHaveLength(0);
  });

  it(`should call login when information is filled correctly and navigate to ${ROUTES.HOME}`, async () => {
    renderWithRouterAndContext(<Login />);

    const loginBtn = screen.getByText('Log in');
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    await act(async () => {
      await fireEvent.change(usernameInput, { target: { value: 'qa@videate.io' } });
      await fireEvent.change(passwordInput, { target: { value: 'My Password' } });
      await fireEvent.click(loginBtn);
    });

    expect(loginMock.mock.calls).toHaveLength(1);
    expect(mockedNavigator.mock.calls).toHaveLength(1);
    expect(mockedNavigator).toBeCalledWith(ROUTES.HOME);
  });

  // it(`should show error notification when request fails`, async () => {
  //   const errorMessage = 'There was an error'
  //   const loginMock = jest.fn()
  //     .mockImplementation((args: useLogin.LoginRequest) => ({ error: errorMessage, data: null }))
  //   jest.spyOn(useLogin, 'useLogin')
  //     .mockImplementation(() => ([loginMock, { isLoginIn: false, error: null }]))

  //   renderWithRouterAndContext(<Login />);

  //   const loginBtn = screen.getByText('Log in');
  //   const usernameInput = screen.getByPlaceholderText('Username');
  //   const passwordInput = screen.getByPlaceholderText('Password');

  //   await act(async () => {
  //     await fireEvent.change(usernameInput, { target: { value: 'qa@videate.io' } })
  //     await fireEvent.change(passwordInput, { target: { value: 'My Password' } })
  //     await fireEvent.click(loginBtn)
  //   })

  //   expect(loginMock.mock.calls).toHaveLength(1)
  //   expect(mockErrorNotification.mock.calls).toHaveLength(0)
  //   expect(mockedNavigator.mock.calls).toHaveLength(0)

  //   // expect(mockErrorNotification).toBeCalledWith(APP_ROUTES.SPIELS)
  // });
});
