import { Button, Form, Input, ModalProps, Space } from 'antd';
import { ValidatorRule } from 'rc-field-form/es/interface';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useEffect, useState } from 'react';
import { isEmpty, trim } from 'lodash';
import { isInSubnet } from 'is-in-subnet';

// @components
import { Modal } from 'components/Modal/Modal';

// @types
import { Terminal } from 'shared/types/Terminals';

// @utils
import { notEmptyTextValidator } from 'shared/utils/Strings';
import { isValidHostname, isValidIPAddress } from 'shared/utils/Http';

// @constants
import { NON_ROUTABLE_ROUTES } from '../NonRoutableMessage/constants';
import { NonRoutableMessage } from 'components/NonRoutableMessage/NonRoutableMessage';

export interface TerminalModalProps extends Omit<ModalProps, 'onCancel|onOk'> {
  terminal?: Terminal;
  onCancel?: (...args: any) => any;
  onOk?: (...args: any) => Promise<any>;
}

const MAX_CHARACTER_LIMIT = 100;
const EMPTY_TERMINAL = {
  name: '',
  host: '',
  username: '',
  password: '',
};

export const TerminalModal: FC<TerminalModalProps> = ({ terminal, onCancel, ...props }) => {
  /**
   * hooks
   */
  const [form] = Form.useForm<Terminal>();

  /**
   * State
   */
  const [showNotRoutableMessage, setShowNotRoutableMessage] = useState(false);
  const passwordValue = Form.useWatch('password', form);

  /**
   * handlers
   */
  const handleHostnameValidation: ValidatorRule['validator'] = async (_, hostname) => {
    let nonRoutableIp = false;

    if (!isValidHostname(hostname)) {
      throw new Error();
    }

    const isIPAddress = isValidIPAddress(hostname);
    if (isIPAddress) {
      const isNonRoutableIP = isInSubnet(hostname, Object.keys(NON_ROUTABLE_ROUTES));
      nonRoutableIp = isIPAddress && isNonRoutableIP;
    }
    setShowNotRoutableMessage(nonRoutableIp);
    if (nonRoutableIp) {
      throw new Error();
    }
  };
  const handleCloseModal = () => {
    form.setFieldsValue(EMPTY_TERMINAL);
    onCancel?.();
  };

  const handleFinishForm = async ({ id, ...formValues }: Terminal) => {
    const { error } =
      (await props.onOk?.(
        {
          ...terminal,
          ...formValues,
          name: trim(formValues.name),
        },
        isNewTerminal
      )) || {};
    if (error) {
      return;
    }

    form.resetFields();
  };

  /**
   * Effects
   */
  useEffect(() => {
    if (terminal) {
      form.setFieldsValue(terminal);
    } else {
      form.setFieldsValue(EMPTY_TERMINAL);
    }
  }, [terminal]);

  /**
   * Conditional rendering
   */
  const isNewTerminal = !terminal?.id;

  return (
    <Modal
      footer={null}
      title={`${isNewTerminal ? 'New' : 'Update'} Terminal`}
      onCancel={handleCloseModal}
      {...props}
    >
      <Form form={form} initialValues={terminal} onFinish={handleFinishForm} layout='vertical'>
        <Form.Item hidden name='id' />
        <Form.Item
          label='Name'
          rules={[
            { required: true, message: 'Please enter a name' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
            { validator: notEmptyTextValidator },
          ]}
          name='name'
        >
          <Input maxLength={MAX_CHARACTER_LIMIT} />
        </Form.Item>
        <Form.Item
          label='Host name / IP'
          rules={[
            { required: true, message: 'Please enter a host' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
            {
              type: 'string',
              message: 'Please enter a valid host',
              validator: handleHostnameValidation,
            },
          ]}
          name='host'
        >
          <Input maxLength={MAX_CHARACTER_LIMIT} />
        </Form.Item>
        {showNotRoutableMessage && <NonRoutableMessage />}
        <Form.Item
          label='Username'
          rules={[
            { required: !isEmpty(passwordValue), message: 'Please enter a username' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
          ]}
          dependencies={['password']}
          name='username'
        >
          <Input maxLength={MAX_CHARACTER_LIMIT} autoComplete='username' />
        </Form.Item>
        <Form.Item
          label='Password'
          rules={[{ max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' }]}
          name='password'
        >
          <Input.Password maxLength={MAX_CHARACTER_LIMIT} autoComplete='current-password' />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => {
            const { name, host, username, password } = form.getFieldsValue();
            const requiredFieldsFilled = !!name && !!host && (password ? !!username : true);
            const shouldDisableSubmit =
              !requiredFieldsFilled ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length;

            return (
              <Space className='flex-end'>
                <Button
                  type='primary'
                  icon={isNewTerminal ? <PlusOutlined /> : <EditOutlined />}
                  size='large'
                  htmlType='submit'
                  disabled={shouldDisableSubmit}
                >
                  {isNewTerminal ? 'Create' : 'Update'}
                </Button>
              </Space>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};
