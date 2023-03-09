import { createElement, useEffect } from 'react';
import { Drawer, Image, Layout, MenuItemProps } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

// @components
import { ProjectSection } from 'components/ProjectSection/ProjectSection';
import { MenuOptions } from 'components/MenuOptions/MenuOptions';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useLocalState } from 'shared/hooks/useLocalState';

// @styles
import styles from './styles.module.scss';
import { SIDEBAR_STATE } from 'shared/constants';

const { Sider } = Layout;
export interface MenuSectionProps extends MenuItemProps {
  collapsed: boolean;
}

export const Sidebar = () => {
  /**
   * hooks
   */
  const [{ isSidebarCollapsed, isMobileView, selectedProject }, setSharedData] =
    useSharedDataContext();

  /**
   * State
   */
  const [sidebarState, setSidebarState] = useLocalState<{ collapsed: boolean }>(
    { collapsed: false },
    SIDEBAR_STATE
  );
  const { collapsed } = sidebarState;

  /**
   * Effects
   */
  useEffect(() => {
    setSidebarState({ collapsed: !!isSidebarCollapsed });
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (isMobileView) {
      toggleCollapseMenu();
    }
  }, [selectedProject, location.pathname, isMobileView]);

  /**
   * Callbacks
   */
  const toggleCollapseMenu = () => {
    if (isMobileView) {
      setSharedData((prev) => ({ ...prev, isSidebarCollapsed: false }));
    } else {
      setSidebarState((prevState) => ({ collapsed: !prevState.collapsed }));
    }
  };

  /**
   * Conditional rendering
   */
  const Logo = <Image src='/images/logo.svg' preview={false} />;
  const ToggleIcon = createElement(
    collapsed && !isMobileView ? ArrowRightOutlined : ArrowLeftOutlined,
    {
      className: 'trigger',
      onClick: toggleCollapseMenu,
    }
  );
  const Title = (
    <div className={classNames(styles.title, { [styles.collapsed]: collapsed })}>
      {Logo}
      {ToggleIcon}
    </div>
  );

  const ProjectComponent = <ProjectSection collapsed={collapsed && !isMobileView} />;
  const MenuComponent = <MenuOptions collapsed={collapsed && !isMobileView} />;

  return isMobileView ? (
    <Drawer
      className={styles.drawer}
      placement='left'
      title={Title}
      open={collapsed}
      closable={false}
    >
      {ProjectComponent}
      {MenuComponent}
    </Drawer>
  ) : (
    <Sider
      className={classNames(styles.sidebar, { [styles.normalized]: !collapsed })}
      theme='light'
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      {Title}
      {ProjectComponent}
      {MenuComponent}
    </Sider>
  );
};
