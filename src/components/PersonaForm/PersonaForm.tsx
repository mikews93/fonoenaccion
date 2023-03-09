import { Button, Form, FormProps, Input, Select, Slider, Space, Switch } from 'antd';
import classNames from 'classnames';
import { FC, useState } from 'react';

// @types
import { MOUSE_TYPES, PersonaType } from 'shared/types/personaType';

// @styles
import styles from './styles.module.scss';
import { useGetRequest } from 'shared/hooks/useRequest';
import { useSharedDataContext } from 'shared/context/useSharedData';
import { LanguagePretty } from 'shared/types/languages';
import { buildVoicesOptions } from 'shared/utils/Voices';
import { Voice } from 'shared/types/voices';
import { generateSlug, notEmptyTextValidator } from 'shared/utils/Strings';
import { defaultLanguage } from 'shared/languages';

interface PersonaFromProps extends FormProps<PersonaType> {
  finishText?: string;
  loading?: boolean;
}

export const PersonaForm: FC<PersonaFromProps> = ({
  finishText = 'Save',
  className,
  loading,
  onFinish,
  ...props
}) => {
  /**
   * hooks
   */
  const [form] = Form.useForm<PersonaType>();
  const [sharedData] = useSharedDataContext();

  /**
   * state
   */
  const [selectedLanguage, setSelectedLanguage] = useState(props.initialValues?.language);
  const [voicePaceValue, setVoicePaceValue] = useState(props.initialValues?.voicePace);
  const [mouseAccelerationValue, setMouseAccelerationValue] = useState(
    props.initialValues?.mouseAcceleration
  );

  /**
   * queries
   */
  const [languages] = useGetRequest<LanguagePretty[]>(
    `clients/${sharedData.selectedClient}/languages?pretty=1`
  );

  const [voices] = useGetRequest<Voice[]>(
    `voices?pretty=1&filter={"where": { "and": [{"language": "${selectedLanguage}"}, {"customerVisible": true}]}}`,
    null,
    undefined,
    { suspense: false }
  );

  /**
   * Callbacks
   */
  const handleVoicePaceChange = (value: number) => {
    form.setFieldValue('voicePace', value);
    setVoicePaceValue(value);
  };
  const handleMouseAccelerationChange = (value: number) => {
    form.setFieldValue('mouseAcceleration', value);
    setMouseAccelerationValue(value);
  };
  const handleVoiceChange = (value: string) => {
    const voiceObject = voices.find(({ voice }) => voice === value);
    if (!form.isFieldTouched('name') && voiceObject) {
      form.setFieldValue('name', voiceObject.name);
    }
    form.setFieldValue('voiceEngine', voiceObject?.engine);
  };
  const handleLanguageChange = (value: string) => {
    form.setFieldValue('voice', null);
    setSelectedLanguage(value);
    if (!form.isFieldTouched('name')) {
      form.setFieldValue('name', null);
    }
  };
  const handleFinish = (values: PersonaType) =>
    onFinish?.({ ...values, defaultFor: values.defaultFor ? values.language : undefined });

  const languagesOptions = languages.length === 0 ? defaultLanguage : languages;

  return (
    <Form
      {...props}
      className={classNames(styles.personaForm, className)}
      form={form}
      layout='vertical'
      onFinish={handleFinish}
    >
      <Form.Item hidden name='voiceEngine'>
        <Input />
      </Form.Item>
      <Form.Item
        label='Name'
        rules={[
          { required: true, message: 'Please enter a name' },
          { validator: notEmptyTextValidator },
        ]}
        name='name'
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Mouse'
        rules={[{ required: true, message: 'Please enter a mouse' }]}
        name='mousePersona'
      >
        <Select>
          {Object.entries(MOUSE_TYPES).map(([label, value]) => (
            <Select.Option value={value} key={generateSlug()}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label='Language'
        rules={[{ required: true, message: 'Please enter a language' }]}
        name='language'
      >
        <Select onChange={handleLanguageChange}>
          {languagesOptions.map(({ label, options }) => (
            <Select.OptGroup label={label} key={generateSlug()}>
              {options.map(({ value, label, icon }) => (
                <Select.Option value={value} key={generateSlug()}>
                  <Space>
                    {icon} {label}
                  </Space>
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='Voice'
        rules={[
          { required: true, message: 'Please enter a voice' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('language')) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('You must select a language'));
            },
          }),
        ]}
        dependencies={['language']}
        name='voice'
      >
        <Select onChange={handleVoiceChange}>
          {buildVoicesOptions(voices).map(({ label, options }) => (
            <Select.OptGroup label={label} key={generateSlug()}>
              {options.map(({ value, label }) => (
                <Select.Option value={value} key={generateSlug()}>
                  {label}
                </Select.Option>
              ))}
            </Select.OptGroup>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label='Voice pace'
        rules={[{ required: true, message: 'Please enter a voice pace' }]}
        name='voicePace'
      >
        <div className={styles.slider}>
          <Slider
            max={2.0}
            min={0.5}
            onChange={handleVoicePaceChange}
            step={0.1}
            value={voicePaceValue}
          />
          {voicePaceValue}x
        </div>
      </Form.Item>
      <Form.Item
        label='Mouse Acceleration'
        rules={[{ required: true, message: 'Please enter a mouse acceleration' }]}
        name='mouseAcceleration'
      >
        <div className={styles.slider}>
          <Slider
            dots
            max={3}
            min={1}
            onChange={handleMouseAccelerationChange}
            step={0.5}
            value={mouseAccelerationValue}
          />
          {mouseAccelerationValue}
        </div>
      </Form.Item>
      <Form.Item
        label={`Default for: ${selectedLanguage}`}
        rules={[{ required: false, message: 'Please enter a name' }]}
        name='defaultFor'
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>
      <Button type='primary' htmlType='submit' size='large' loading={loading}>
        {finishText}
      </Button>
    </Form>
  );
};
