import {
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Image, MenuProps } from 'antd';
import { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

// @components
import { SearchBox } from 'components/SearchBox/SearchBox';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import {
  createSwitchCookie,
  getRefreshToken,
  isUserAuthenticated,
  isValidJWT,
  logout,
  removeLSAuth,
} from 'shared/utils/Auth';

// @routes
import { APP_ROUTES, ORGANIZATIONAL_ROUTES, USER_ROUTES } from 'shared/routes';

// @constants
import { DEBOUNCE_TIME } from 'shared/constants';

// @api
import { requestNewAccessToken } from 'shared/api/api';

// @styles
import styles from './styles.module.scss';

export const AppHeader = () => {
  /**
   * hooks
   */
  const [sharedData, setSharedData] = useSharedDataContext();
  const location = useLocation();

  /**
   * State
   */
  const [open, setOpen] = useState(false);

  /**
   * Callbacks
   */
  const handleOpenChange = (flag: boolean) => setOpen(flag);
  const userInfo = sharedData.user.info;
  const handleSearch = useCallback(
    debounce(
      (searchText?: string) => setSharedData((prevState) => ({ ...prevState, searchText })),
      DEBOUNCE_TIME
    ),
    []
  );

  const handleClickToggleDrawer = () => setSharedData({ ...sharedData, isSidebarCollapsed: true });

  const handleSwitchBackToClassic = async (): Promise<void> => {
    const goTo = sharedData.settings.classicConsoleUrl;
    if (!goTo) {
      return;
    }
    // TODO: OLD UI FIX
    // * this statement will help to create cookie with updated info and tokens in case
    // * the token has expired
    const isAuthenticated = isUserAuthenticated();
    const refreshToken = getRefreshToken();
    const refreshTokenIsValid = isValidJWT(refreshToken);
    let userData = sharedData.user.info;

    if (!isAuthenticated && !refreshTokenIsValid) {
      logout();
      return;
    }

    if (!isAuthenticated && refreshTokenIsValid) {
      const { data } = await requestNewAccessToken(refreshToken);
      userData = data;
    }

    if (!userData) {
      console.error('could not get user info');
      return;
    }

    createSwitchCookie({ ...userData, refreshToken });
    // Remove userinfo when going back to classic in other to copy exact info
    // when coming back to this UI
    removeLSAuth();
    window.location.replace(goTo);
  };

  /**
   * Conditional rendering
   */
  const items: MenuProps['items'] = [
    {
      label: (
        <div className='flex-column'>
          <strong>{userInfo?.name}</strong>
          <span>{userInfo?.email}</span>
        </div>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: <Link to={USER_ROUTES.PROFILE}>View Profile</Link>,
      icon: <UserOutlined />,
      key: '1',
    },
    {
      label: 'Logout',
      icon: <LogoutOutlined />,
      key: '2',
      onClick: () => logout(),
    },
  ];

  const showOnPage: string[] = [
    APP_ROUTES.SPIELS,
    APP_ROUTES.PERSONAS,
    APP_ROUTES.VIDEOS,
    APP_ROUTES.ASSETS,
    ORGANIZATIONAL_ROUTES.REPLACEMENTS,
  ];
  const shouldShowSearchBox = showOnPage.includes(location.pathname.slice(1));
  return (
    <div className={styles.appHeader}>
      <MenuOutlined className={styles.toggleDrawer} onClick={handleClickToggleDrawer} />
      {shouldShowSearchBox ? <SearchBox onSearch={handleSearch} resetOnLocationChange /> : <span />}
      <div className={styles.optionsLayout}>
        <Button
          className={styles.switchToClassic}
          icon={<LoginOutlined className={styles.backIcon} />}
          onClick={handleSwitchBackToClassic}
        >
          Switch back to classic Videate
        </Button>
        <div className={styles.profileOptions}>
          <Dropdown
            menu={{ items }}
            onOpenChange={handleOpenChange}
            open={open}
            trigger={['click']}
          >
            <Button
              shape='circle'
              className={styles.userMenuBtn}
              type='text'
              onClick={(e) => e.preventDefault()}
            >
              <Avatar
                src={
                  <Image
                    preview={false}
                    src={userInfo?.avatarUrl || '/images/userProfileFallback.png'}
                  />
                }
              />
              <MoreOutlined className={styles.moreIcon} />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
