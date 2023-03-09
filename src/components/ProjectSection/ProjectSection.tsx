import { useCallback, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Image, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

// @components
import { Option, Select } from 'components/Select/Select';

// @types
import { MenuSectionProps } from 'components/Sidebar/Sidebar';

// @constants
import { APP_ROUTES } from 'shared/routes';
import { AUTH_PROFILE, SELECTED_PROJECT } from 'shared/constants';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';

// @context
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { setSessionStorage } from 'shared/utils/SessionStorage';
import { setUserInApplication } from 'shared/utils/Auth';

// @types
import { ProjectType } from 'shared/types/projectType';
import { ClientType } from 'shared/types/clientType';
import { UserType } from 'shared/types/userType';

// @styles
import styles from './styles.module.scss';
import { getLocalStorage, setLocalStorage } from 'shared/utils/LocalStorage';

export const ProjectSection = ({ collapsed }: MenuSectionProps) => {
  /**
   * hooks
   */
  const navigate = useNavigate();
  const location = useLocation();
  const [sharedData, setSharedData] = useSharedDataContext();

  /**
   * queries
   */
  const [clients, { isLoading: isClientLoading }] = useGetRequest<ClientType[]>('clients', null);
  const [changeClientLegacyApi] = useMutationRequest();
  const [getSessionFN] = useMutationRequest<any, UserType>(
    [sharedData.settings.legacyApiUrl, 'session/me'].join('/'),
    'GET'
  );
  const [projects, { mutate }] = useGetRequest<ProjectType[]>('projects', {
    where: {
      clientid: sharedData.selectedClient,
    },
  });
  const [clientCfg] = useGetRequest<{ wistia: boolean }>(
    `clients/${sharedData.selectedClient || 0}/offboarding`,
    null
  );

  /**
   * effects
   */
  useEffect(() => {
    if (!sharedData.selectedClient && clients.length) {
      handleClientChange(clients[0].id);
    }
    // refetch projects on client change
    mutate([]);
  }, [sharedData.selectedClient]);
  useEffect(() => {
    if (projects.length) {
      if (projects.length === 1 || !sharedData.selectedProject) {
        setSharedData((prevData) => ({ ...prevData, [SELECTED_PROJECT]: projects[0] }));
        setSessionStorage({ key: SELECTED_PROJECT, value: projects[0] });
      }
    }
  }, [!!projects.length, sharedData.selectedClient]);
  useEffect(() => {
    const clientSettings = {
      hasWistiaConfig: !!clientCfg.wistia,
    };
    setSharedData((prev) => ({
      ...prev,
      clientSettings: clientSettings,
    }));
    setLocalStorage({
      key: AUTH_PROFILE,
      value: {
        ...getLocalStorage(AUTH_PROFILE),
        clientConfig: clientSettings,
      },
    });
  }, [clientCfg]);

  /**
   * Callbacks
   */
  const handleClientChange = useCallback(
    async (clientID: ClientType['id']) => {
      if (!sharedData.user.info) {
        return;
      }

      await changeClientLegacyApi(
        null,
        'PUT',
        [sharedData.settings.legacyApiUrl, 'session/clients', clientID].join('/')
      );

      const { data } = await getSessionFN(null);

      setUserInApplication(
        {
          ...sharedData.user.info,
          sessions: data?.sessions || [],
          clientID,
        },
        setSharedData
      );
      if (location.pathname !== ['/', APP_ROUTES.SPIELS].join('')) {
        navigate(['/', APP_ROUTES.SPIELS].join(''));
      }
    },
    [sharedData.selectedClient]
  );

  const projectLogo = <Image preview={false} src='/images/favicon.png' />;
  return (
    <>
      <div className={classNames(styles.projectsSection, { [styles.collapsed]: collapsed })}>
        <div className={styles.selectProject}>
          <Select
            className={styles.clientSelect}
            value={sharedData.selectedClient}
            onChange={handleClientChange}
            loading={isClientLoading}
            showSearch
            placeholder='Select a client'
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {clients.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.projectDetails}>
          {projectLogo}
          <div>
            <Typography className={styles.title}>{sharedData.selectedProject?.name}</Typography>
            <Typography className={styles.subTitle}>
              Updated {moment(sharedData.selectedProject?.lastModified).fromNow()}
            </Typography>
          </div>
          <div className={styles.version}>
            {/* TODO:  uncomment when working on project versions */}
            {/* <Select defaultValue='0.2'>
							<Option value='0.1'>v0.1</Option>
							<Option value='0.2'>v0.2</Option>
						</Select> */}
          </div>
        </div>
      </div>
      {collapsed && <div className={styles.collapsedProject}>{projectLogo}</div>}
    </>
  );
};
