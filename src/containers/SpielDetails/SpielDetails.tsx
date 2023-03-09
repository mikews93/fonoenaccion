import { CloudUploadOutlined, FileTextOutlined, FontSizeOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, RadioChangeEvent, Select, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

// @hooks
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useCallbackPrompt } from 'shared/utils/Miscellaneous';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetRequest } from 'shared/hooks/useRequest';
import { useMessageHandler } from './useMessageHandler';
import { useForm } from 'antd/es/form/Form';

// @components
import { SpielDetailsControls } from 'components/SpielDetailsControls/SpielDetailsControls';
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { CodeEditor, MODES } from 'components/CodeEditor/CodeEditor';
import { DropZone } from 'components/DropZone/DropZone';
import { Option } from 'components/Select/Select';

// @constants
import { SPIEL_UPLOAD_CONFIG } from 'shared/constants';
import { APP_ROUTES } from 'shared/routes';

// @types
import { PersonaType } from 'shared/types/personaType';
import { SpielType } from 'shared/types/spielType';

// @styles
import styles from './styles.module.scss';

export default function SpielDetails() {
  /**
   * hooks
   */
  const [highlightedLine] = useMessageHandler();
  const [sharedData] = useSharedDataContext();
  const location = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [form] = useForm();

  /**
   * Queries
   */
  const [spiel, { mutate: refetchSpiel }] = useGetRequest<SpielType>(location.pathname, null);
  const [personas] = useGetRequest<PersonaType[]>('personas');

  /**
   * State
   */
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [spielMode, setSpielMode] = useState<MODES>(MODES.EDIT);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLockedByOther, setIsLockedByOther] = useState(false);
  const [isLockedByMe, setIsLockedByMe] = useState(false);
  const [showUnsavedChangeModal, confirmToNavigateAway, cancelNavigatingAway] =
    useCallbackPrompt(hasUnsavedChanges);

  /**
   * Effects
   */
  useEffect(() => {
    const userName = sharedData.user.info?.name;
    const spielLockedByOther = spiel.locked_by !== null && userName !== spiel.locked_by;
    const spielLockedByMe = userName === spiel.locked_by;

    setSpielMode(!spielLockedByMe ? MODES.DISABLED : MODES.EDIT);
    setIsLockedByOther(spielLockedByOther);
    setIsLockedByMe(spielLockedByMe);

    handleRefreshSpiel();
  }, [spiel, sharedData.user.info?.id, isLockedByOther, isLockedByMe]);

  /**
   * Callbacks
   */
  const handleGoToAllSpiels = () => navigate(['/', APP_ROUTES.SPIELS].join(''));
  const handleChangeSpielMode = ({ target: { value } }: RadioChangeEvent) => setSpielMode(value);
  const handleTriggerUploadOverlay = () => setShowUploadOverlay(true);
  const handleFieldChange = () => setHasUnsavedChanges(true);
  const handleUpdateSpiel = () => setHasUnsavedChanges(false);
  const handleSuccessUpload = () => refetchSpiel(spiel);
  const handleRefreshSpiel = () => form.resetFields();

  return (
    <>
      <ContainerPage
        className={styles.spielDetails}
        title='Spiel details'
        onBack={handleGoToAllSpiels}
        extra={
          <SpielDetailsControls
            isLockedByOther={isLockedByOther}
            isLockedByMe={isLockedByMe}
            onAfterUpdateSpiel={handleUpdateSpiel}
            form={form}
          />
        }
      >
        <DropZone
          config={Object.assign(SPIEL_UPLOAD_CONFIG, {
            metaFields: {
              body: JSON.stringify({
                clientId: sharedData.selectedClient,
                projectId: sharedData.selectedProject?.id,
              }),
            },
          })}
          isOverlayActive={showUploadOverlay}
          setIsOverlayActive={setShowUploadOverlay}
          childrenWrapperClass={styles.dropZoneChildrenWrapper}
          onSuccessUpload={handleSuccessUpload}
        >
          <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            initialValues={spiel}
            onFieldsChange={handleFieldChange}
            disabled={!isLockedByMe}
          >
            <Space className={styles.basicInfo}>
              <Form.Item
                label='Title'
                rules={[{ required: true, message: 'Please enter a title' }]}
                name='title'
              >
                <Input />
              </Form.Item>
              <Form.Item
                label='Persona'
                rules={[{ required: true, message: 'Please enter a title' }]}
                name='personaid'
              >
                <Select>
                  {personas?.map(({ id, name }) => (
                    <Option key={id} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Space>
            <Space className={styles.editorControls}>
              <Radio.Group
                value={spielMode}
                onChange={handleChangeSpielMode}
                className={styles.spielModes}
              >
                <Radio.Button value={MODES.READ}>
                  <FontSizeOutlined />
                </Radio.Button>
                <Radio.Button value={MODES.EDIT}>
                  <FileTextOutlined />
                </Radio.Button>
              </Radio.Group>
              <Button
                value='inline'
                type='text'
                icon={<CloudUploadOutlined />}
                onClick={handleTriggerUploadOverlay}
                shape='circle'
              />
            </Space>
            <div className={styles.codeEditorFormItem} ref={ref}>
              <Form.Item
                rules={[{ required: true, message: 'Please type some code' }]}
                name='spiel'
              >
                <CodeEditor
                  parentRef={ref}
                  className={styles.codeEditor}
                  mode={spielMode}
                  highlightedLine={highlightedLine}
                />
              </Form.Item>
            </div>
          </Form>
        </DropZone>
      </ContainerPage>
      <Modal
        title='You have unsaved changes'
        open={showUnsavedChangeModal}
        onOk={confirmToNavigateAway}
        onCancel={cancelNavigatingAway}
      >
        Are you sure you want to leave this page?
      </Modal>
    </>
  );
}
