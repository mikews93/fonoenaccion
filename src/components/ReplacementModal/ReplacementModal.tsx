import { FC, useEffect } from 'react';
import { Button, Divider, Form, Input, ModalProps, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

// @hooks
import { useMutationRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useGetLanguages } from 'shared/hooks/useGetLanguages';

// @components
import { VoicePreviewer } from 'components/VoicePreviewer/VoicePreviewer';
import { Modal } from 'components/Modal/Modal';

// @types
import { Replacement } from 'shared/types/replacementTypes';

// @constants
import {REPLACEMENT_TYPES, REPLACEMENT_VOICE_TEMPLATES} from 'shared/constants';

// @utils
import { generateSlug } from 'shared/utils/Strings';
import { getFirstLanguage, hasOneLanguage } from 'shared/utils/Languages';

// @styles
import styles from './styles.module.scss';

interface ReplacementModalProps extends Omit<ModalProps, 'onCancel'> {
  replacement?: Replacement;
  onCancel?: (options?: { refreshQuery?: boolean }) => void;
}

const MAX_CHARACTER_LIMIT = 100;

export const ReplacementModal: FC<ReplacementModalProps> = ({
  replacement,
  onCancel,
  ...props
}) => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [sharedData] = useSharedDataContext();
  const [form] = Form.useForm<Replacement>();
  const languages = useGetLanguages();

  /**
   * State
   */
  const typeValue = Form.useWatch('repltype', form);
  const targetValue = Form.useWatch('target', form);
  const languagesValue = Form.useWatch('languages', form);
  const replacementValue = Form.useWatch('replacement', form);

  // convert the string type back to enum
  const replType = REPLACEMENT_TYPES[typeValue?.toUpperCase() as keyof typeof REPLACEMENT_TYPES];
  // look up the correct voice preview template
  const voicePreviewText = REPLACEMENT_VOICE_TEMPLATES[replType]?.(targetValue, replacementValue);
  // simplified text to display in the voice preview panel
  const voicePreviewDisplay = replType === REPLACEMENT_TYPES.ABBR
    ? targetValue?.toUpperCase().split('').join('-')
    : replacementValue;

  /**
   * Queries
   */
  const [mutateReplacement] = useMutationRequest();

  /**
   * Effects
   */
  useEffect(() => {
    if (replacement) {
      form.setFieldsValue(replacement);
    } else {
      form.setFieldsValue({
        target: '',
        repltype: 'sub',
        replacement: '',
        languages: [],
      });
    }
  }, [replacement]);

  useEffect(() => {
    if (hasOneLanguage(languages)) {
      form.setFieldValue('languages', [getFirstLanguage(languages)]);
    }
  }, [languages, props.open]);

  /**
   * Callbacks
   */
  const handleClose = () => {
    onCancel?.();
    form.resetFields();
  };
  const handleFinishForm = async (formValues: Replacement) => {
    const { error } = await mutateReplacement(
      {
        ...replacement,
        ...formValues,
        clientid: replacement?.clientid ?? sharedData.selectedClient,
      },
      isNewReplacement ? 'POST' : 'PUT',
      `${location.pathname}${isNewReplacement ? '' : `/${replacement.id}`}`,
      { injectProject: false }
    );
    if (error) {
      return errorNotification(
        'Replacements error',
        `Could not ${isNewReplacement ? 'create' : 'update'} Replacement`,
        {
          error,
        }
      );
    }
    onCancel?.({ refreshQuery: true });
    form.resetFields();
    return successNotification(
      'Success',
      `Replacement ${isNewReplacement ? 'created' : 'updated'} successfully`
    );
  };

  /**
   * ConditionalRendering
   */
  const isNewReplacement = !replacement?.id;

  const disableReplacementField =
    typeValue ===
    Object.entries(REPLACEMENT_TYPES)
      .find(([_, value]) => value === REPLACEMENT_TYPES.ABBR)?.[0]
      ?.toLowerCase();

  const selectReplacementTypes = sharedData.featureFlags?.replacementsPhonemes
    ? Object.entries(REPLACEMENT_TYPES)
    : Object.entries(REPLACEMENT_TYPES).filter(([, label]) => label !== REPLACEMENT_TYPES.PHONEME);

  const voicePreviewerLanguages = isEmpty(languagesValue)
    ? languages.reduce(
        (acc, { options }) => [...acc, ...options.map(({ label }) => label)],
        [] as string[]
      )
    : (languagesValue as string[]);

  return (
    <Modal
      className={styles.replacementModal}
      destroyOnClose
      footer={null}
      onCancel={handleClose}
      title={`${isNewReplacement ? 'New' : 'Update'} Replacement`}
      {...props}
    >
      <Form form={form} initialValues={replacement} onFinish={handleFinishForm} layout='vertical'>
        <Form.Item
          label='Source'
          rules={[
            { required: true, message: 'Please enter a source' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
          ]}
          name='target'
        >
          <Input maxLength={MAX_CHARACTER_LIMIT} />
        </Form.Item>
        <Form.Item
          label='Type'
          rules={[{ required: true, message: 'Please enter a type' }]}
          name='repltype'
        >
          <Select placeholder='Choose one'>
            {selectReplacementTypes.map(([value, label], key) => (
              <Select.Option key={key} value={value.toLowerCase()}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='Replacement'
          rules={[
            { required: !disableReplacementField, message: 'Please enter a replacement' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
          ]}
          name='replacement'
          tooltip={disableReplacementField ? 'Abbreviation replacement is autogenerated' : null}
        >
          <Input
            showCount
            maxLength={MAX_CHARACTER_LIMIT}
            placeholder={
              disableReplacementField ? targetValue?.toUpperCase().split('').join('-') : 'Required*'
            }
            disabled={disableReplacementField}
          />
        </Form.Item>
        <Form.Item
          label='Language / Region'
          rules={[{ required: true, message: 'Please enter a language' }]}
          name='languages'
        >
          <Select mode='multiple' allowClear className={styles.multiLanguageSelect}>
            {languages.map(({ label, options }) => (
              <Select.OptGroup label={label} key={generateSlug()}>
                {options.map(({ value, label, icon }) => (
                  <Select.Option value={value} key={generateSlug()}>
                    {icon} {label}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>
        <Divider orientation='left' orientationMargin='0' plain>
          Live preview
        </Divider>
        <VoicePreviewer
          languages={voicePreviewerLanguages}
          textToPlay={voicePreviewText}
          textToDisplay={voicePreviewDisplay}
          noTextCaption='[No replacement text provided]'
        />
        <Space className='flex-end'>
          <Button type='primary' icon={<PlusOutlined />} size='large' htmlType='submit'>
            {isNewReplacement ? 'Add' : 'Update'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
