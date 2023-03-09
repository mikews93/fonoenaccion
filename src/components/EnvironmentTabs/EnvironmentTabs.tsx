import { Button, Tabs, TabsProps } from 'antd';
import { capitalize } from 'lodash';
import {
  createElement,
  Dispatch,
  FC,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { CodeOutlined, PlusOutlined } from '@ant-design/icons';

// @components
import { ProductsTable } from 'components/ProductsTable/ProductsTable';

// @types
import { TerminalsTable } from 'components/TerminalsTable/TerminalsTable';
import { Environment } from 'shared/types/environments';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

interface EnvironmentTabsProps {
  environment: Environment;
}

export interface EnvironmentTabItem extends EnvironmentTabsProps {
  setShowAddNewRecordModal: Dispatch<SetStateAction<boolean>>;
  showAddNewRecordModal: boolean;
  selectedTabKey: TABS;
  isTerminalFFEnabled?: boolean;
}

enum TABS {
  products = 'products',
  terminals = 'terminals',
}

const tabPanes: { [key in TABS]: FunctionComponent<any> } = {
  [TABS.products]: ProductsTable,
  [TABS.terminals]: TerminalsTable,
};

const getItems = ({ isTerminalFFEnabled, ...props }: EnvironmentTabItem): TabsProps['items'] => {
  let displayTabs = Object.values(TABS);
  if (!isTerminalFFEnabled) {
    displayTabs = displayTabs.filter((tab) => tab !== TABS.terminals);
  }

  return displayTabs.map((tab) => ({
    key: tab,
    label: capitalize(tab),
    children: createElement(tabPanes[tab] || <></>, {
      ...props,
      showAddNewRecordModal: props.showAddNewRecordModal && tab === props.selectedTabKey,
    }),
  }));
};

export const EnvironmentTabs: FC<EnvironmentTabsProps> = ({ environment }) => {
  /**
   * Hooks
   */
  const { hash } = useLocation();
  const [{ featureFlags }] = useSharedDataContext();
  const [showAddNewRecordModal, setShowAddNewRecordModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TABS>((hash as TABS) || TABS.products);

  /**
   * Effects
   */
  useEffect(() => {
    setSelectedTab(hash ? (hash as TABS) : TABS.products);

    return () => {
      setSelectedTab(TABS.products);
    };
  }, [hash]);

  /**
   * Handlers
   */
  const handleChangeTab = (tabKey: string) => {
    setSelectedTab(tabKey as TABS);

    if (showAddNewRecordModal) {
      setShowAddNewRecordModal(false);
    }
  };
  const handleClickNewRecord = () => setShowAddNewRecordModal(true);

  /**
   * Conditional rendering
   */
  const renderExtraButtons = () => (
    <Button
      className='mt-2 mb-2'
      type='primary'
      icon={selectedTab === TABS.products ? <PlusOutlined /> : <CodeOutlined />}
      onClick={handleClickNewRecord}
      size='large'
    >
      New {selectedTab}
    </Button>
  );

  return (
    <Tabs
      defaultActiveKey={selectedTab}
      items={getItems({
        environment,
        showAddNewRecordModal,
        setShowAddNewRecordModal,
        selectedTabKey: selectedTab,
        isTerminalFFEnabled: featureFlags?.terminalsUi,
      })}
      className={styles.environmentTabs}
      onChange={handleChangeTab}
      tabBarExtraContent={renderExtraButtons()}
    />
  );
};
