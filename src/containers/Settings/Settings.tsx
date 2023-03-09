// @components
import { Button } from 'antd';
import { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ConfigItem } from 'components/ConfigItem/ConfigItem';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { IntegrationData, IntegrationForm } from 'components/IntegrationForm/IntegrationForm';

// @types
import { WistiaConfig } from 'shared/types/videoTypes';

// @hooks
import { useNotifications } from 'shared/hooks/useNotifications';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';

// @utils
import { getLocalStorage, setLocalStorage } from 'shared/utils/LocalStorage';

// @constants
import { AUTH_PROFILE } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

export default function Settings() {
  /**
   * hooks
   */
  const [
    {
      clientSettings: { hasWistiaConfig },
      selectedClient,
    },
    setSharedData,
  ] = useSharedDataContext();
  const { errorNotification, successNotification } = useNotifications();

  /**
   * Queries
   */
  const [saveWistiaConfig, { isLoading: isSavingWistiaConfig }] = useMutationRequest<
    WistiaConfig,
    null
  >();
  const [{ wistia }] = useGetRequest<{ wistia: boolean }>(
    `clients/${selectedClient}/offboarding`,
    null
  );

  /**
   * State
   */
  const [isEditingWistiaCfg, setIsEditingWistiaCfg] = useState(false);

  /**
   * Handlers
   */
  const handleSaveWistiaConfig = async ({
    apiKey: ProjectID,
    secretKey: AccessToken,
  }: IntegrationData) => {
    const { error } = await saveWistiaConfig(
      { ProjectID, AccessToken },
      'PUT',
      `/clients/${selectedClient}/wistia`,
      {}
    );
    if (error) {
      return errorNotification('Something went wrong', 'Could not save wistia config', { error });
    }
    setIsEditingWistiaCfg(false);
    setSharedData((prev) => ({
      ...prev,
      clientSettings: {
        ...prev.clientSettings,
        hasWistiaConfig: true,
      },
    }));
    setLocalStorage({
      key: AUTH_PROFILE,
      value: { ...getLocalStorage(AUTH_PROFILE), clientConfig: { hasWistiaConfig: true } },
    });

    return successNotification('Success!', 'The config was saved successfully');
  };
  const handleWistiaFormState = () => setIsEditingWistiaCfg(true);
  const handleCancelWistia = () => setIsEditingWistiaCfg(false);

  /**
   * Conditional rendering
   */
  const wistiaConfig = () => {
    const shouldShowWistiaForm = isEditingWistiaCfg || (!wistia && !hasWistiaConfig);
    if (shouldShowWistiaForm) {
      return (
        <IntegrationForm
          title='Wistia'
          onSave={handleSaveWistiaConfig}
          onCancel={isEditingWistiaCfg ? handleCancelWistia : undefined}
          isSaving={isSavingWistiaConfig}
        />
      );
    }

    return (
      <ConfigItem
        title='Wistia'
        subTitle='Update your integration for Wistia with API and Secret Key'
        extra={<Button type='text' icon={<EditOutlined />} onClick={handleWistiaFormState} />}
      />
    );
  };

  return (
    <ContainerPage className={styles.settings} title='Settings' contentMargin='2rem'>
      <div>
        <ConfigItem title='Integrations'>{wistiaConfig()}</ConfigItem>
      </div>
    </ContainerPage>
  );
}
