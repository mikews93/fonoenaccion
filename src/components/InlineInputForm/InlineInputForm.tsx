import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input } from 'antd';
import { FC } from 'react';
import { notEmptyTextValidator } from 'shared/utils/Strings';

// @styles
import styles from './styles.module.scss';

export interface InlineInputFromProps extends Omit<FormProps, 'onFinish'> {
  defaultValue?: string;
  maxLength?: number;
  onCancel?: (...args: any) => any;
  onOk?: FormProps['onFinish'];
  placeholder?: string;
}

const MAX_CHARACTER_LIMIT = 100;

export const InlineInputForm: FC<InlineInputFromProps> = ({
  maxLength = MAX_CHARACTER_LIMIT,
  placeholder = 'Type a name',
  defaultValue,
  onCancel,
  onOk,
  ...props
}) => {
  return (
    <Form
      className={styles.inlineForm}
      initialValues={{ name: defaultValue }}
      onFinish={onOk}
      {...props}
    >
      <div className={styles.layout}>
        <Form.Item
          className={styles.formItem}
          rules={[
            { required: true, message: `Please ${placeholder}` },
            { max: maxLength, message: 'Max character limit reached' },
            { validator: notEmptyTextValidator },
          ]}
          name='name'
        >
          <Input bordered={false} placeholder={placeholder} maxLength={maxLength} autoFocus />
        </Form.Item>
        <div className={styles.actions}>
          <Button
            htmlType='submit'
            icon={<CheckOutlined />}
            shape='circle'
            size='small'
            type='primary'
          />
          <Button
            icon={<CloseOutlined />}
            onClick={onCancel}
            shape='circle'
            size='small'
            type='default'
          />
        </div>
      </div>
    </Form>
  );
};
