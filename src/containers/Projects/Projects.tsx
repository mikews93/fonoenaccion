import { EyeOutlined, FolderOutlined, MoreOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Image, Space } from 'antd';
import Meta from 'antd/es/card/Meta';
import classNames from 'classnames';
import moment from 'moment';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';

// @hooks
import { useGetRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';

// @types
import { ProjectType } from 'shared/types/projectType';

// @constants
import { SELECTED_PROJECT } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

const Projects: FC = () => {
  /**
   * Context
   */
  const [sharedData, setSharedData] = useSharedDataContext();

  /**
   * hooks
   */
  const location = useLocation();

  /**
   * queries
   */
  const [data, { mutate }] = useGetRequest<ProjectType[]>(location.pathname, {
    where: {
      clientid: sharedData.selectedClient,
    },
  });

  /**
   * State
   */
  const [selectedProject, setSelectedProject] = useState(sharedData.selectedProject);

  /**
   * effects
   */
  useEffect(() => {
    // refetch data on clientChange
    mutate([]);
  }, [sharedData.selectedClient]);

  /**
   * Callbacks
   */
  const handleSelectProject = (projectId: ProjectType) => {
    setSelectedProject(projectId);
    setSharedData((prevData) => ({ ...prevData, [SELECTED_PROJECT]: projectId }));
  };

  return (
    <ContainerPage className={styles.projects} title='Projects'>
      {data.map((project) => {
        const onClickProject = () => handleSelectProject(project);
        const isSelected = project.id === selectedProject?.id;

        return (
          <div className={styles.wrapper} key={project.id}>
            <div
              className={classNames(styles.projectCard, { [styles.selected]: isSelected })}
              onClick={onClickProject}
            >
              <Image className={styles.projectImage} src='/images/noPhoto.svg' preview={false} />
              <Meta
                title={
                  <Space className={styles.title}>
                    <FolderOutlined />
                    {project.name}
                  </Space>
                }
                description={
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <EyeOutlined />
                    {moment(project.lastModified).fromNow()}
                    <Button onClick={preventDefaultBehavior} type='text' icon={<MoreOutlined />} />
                  </Space>
                }
              />
            </div>
          </div>
        );
      })}
    </ContainerPage>
  );
};

export default Projects;
