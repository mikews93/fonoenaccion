import {
  CloseCircleOutlined,
  CloseOutlined,
  SaveOutlined,
  SaveTwoTone,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { FC } from 'react';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @styles
import styles from './styles.module.scss';

export type IntegrationData = {
  apiKey: string;
  secretKey: string;
};

interface IntegrationFromProps {
  title: string;
  onSave?: (values: IntegrationData) => void;
  onCancel?: () => void;
  isSaving?: boolean;
}

export const IntegrationForm: FC<IntegrationFromProps> = ({
  title,
  onSave,
  isSaving,
  onCancel,
}) => {
  /**
   * hooks
   */
  const [{ theme }] = useSharedDataContext();
  const [form] = Form.useForm();

  /**
   * Handlers
   */
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  return (
    <Form
      className={styles.integrationForm}
      onFinish={onSave}
      form={form}
      autoComplete='off'
      size='large'
    >
      <div className='space-between'>
        <div className={styles.title}>
          <VerticalAlignTopOutlined style={{ transform: 'rotate(90deg)' }} />
          <Typography.Text strong style={{ marginLeft: '5px' }}>
            {title}
          </Typography.Text>
        </div>
        <div className='flex'>
          {onCancel && (
            <Button
              htmlType='reset'
              onClick={handleCancel}
              icon={<CloseCircleOutlined />}
              type='ghost'
              title='Cancel'
              shape='circle'
            />
          )}
          <Button
            htmlType='submit'
            icon={<SaveTwoTone twoToneColor={theme?.colorPrimary} />}
            type='text'
            loading={isSaving}
            title='Save'
            shape='circle'
          />
        </div>
      </div>
      <Form.Item
        label={
          <Typography.Text className={styles.label} strong>
            API key
          </Typography.Text>
        }
        className={styles.input}
        name='apiKey'
        rules={[{ required: true, message: 'Please input your api key' }]}
      >
        <Input bordered={false} placeholder='aCELgL.0imfnc8mVLWwsAawjYr4Rx-Af50DDqtlx' />
      </Form.Item>
      <Form.Item
        label={
          <Typography.Text className={styles.label} strong>
            Secret key
          </Typography.Text>
        }
        className={styles.input}
        name='secretKey'
        rules={[{ required: true, message: 'Please input your secret key' }]}
      >
        <Input bordered={false} placeholder='4AA551E7FE6FE81F9E3576E35C6CB' />
      </Form.Item>
    </Form>
  );
};
