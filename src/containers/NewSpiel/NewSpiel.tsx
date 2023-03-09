import { useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

// @components
import { ContainerPage } from 'components/ContainerPage/ContainerPage';
import { CodeEditor } from 'components/CodeEditor/CodeEditor';

// @hooks
import { useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';

// @types
import { SpielType } from 'shared/types/spielType';

// @utils
import { normalizeName, notEmptyTextValidator } from 'shared/utils/Strings';

// @constants
import { APP_ROUTES } from 'shared/routes';

// @styles
import styles from './styles.module.scss';

export default function NewSpiel() {
  /**
   * hooks
   */
  const navigate = useNavigate();
  const ref = useRef(null);
  const { errorNotification, successNotification } = useNotifications();
  const [saveDisabled, setSaveDisabled] = useState(true);

  /**
   * queries
   */
  const [createSpiels, { isLoading }] = useMutationRequest<Partial<SpielType>, SpielType>('spiels');

  /**
   * Callbacks
   */
  const goBack = () => navigate(-1);

  const handleCreateNewSpiel = async ({ title, ...values }: Partial<SpielType>) => {
    const { error, data } = await createSpiels({ title: normalizeName(title), ...values });
    if (error) {
      return errorNotification(
        'Error saving spiel',
        'there was an issue while saving spiels',
        error
      );
    }

    successNotification('Awesome!', 'The Spiel was created successfully');
    return navigate(['/', APP_ROUTES.SPIELS, '/', data?.id.toString()].join(''));
  };

  const handleTitleValueChange = (_, allValues) => {
    if (allValues.title && normalizeName(allValues.title).length > 0) {
      setSaveDisabled(false);
    }
  };

  return (
    <ContainerPage className={styles.newSpiel} title='New Spiel' onBack={goBack}>
      <Form layout='vertical' onFinish={handleCreateNewSpiel} autoComplete='off' onValuesChange={handleTitleValueChange}
>
        <Form.Item
          label='Title'
          rules={[
            { required: true, message: 'Please enter a title' },
            { validator: notEmptyTextValidator },
          ]}
          name='title'
        >
          <Input />
        </Form.Item>
        <div className={styles.codeEditorFormItem} ref={ref}>
          <Form.Item rules={[{ required: true, message: 'Please type some code' }]} name='spiel'>
            <CodeEditor parentRef={ref} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type='primary' size='large' htmlType='submit' loading={isLoading} disabled={saveDisabled}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </ContainerPage>
  );
}
