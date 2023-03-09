import { Button, Form, Input, ModalProps, Select, Space } from 'antd';
import { FC, useEffect } from 'react';
import { isEmpty, trim } from 'lodash';

// @components
import { Modal } from 'components/Modal/Modal';
import { Product } from 'shared/types/Products';
import { useMutationRequest } from 'shared/hooks/useRequest';
import { Environment } from 'shared/types/environments';
import { useNotifications } from 'shared/hooks/useNotifications';
import { notEmptyTextValidator } from 'shared/utils/Strings';
import { PlusOutlined } from '@ant-design/icons';

export interface ProductModalProps extends Omit<ModalProps, 'onCancel'> {
  product?: Product;
  environment: Environment;
  onCancel?: (...args: any) => any;
}

const MAX_CHARACTER_LIMIT = 100;
const EMPTY_PRODUCT = {
  name: '',
  loginUrl: 'https://',
  browserProfile: '0',
  username: '',
  password: '',
};

export const ProductModal: FC<ProductModalProps> = ({
  product,
  environment,
  onCancel,
  ...props
}) => {
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [form] = Form.useForm<Product>();

  /**
   * State
   */
  const passwordValue = Form.useWatch('password', form);

  /**
   * Queries
   */
  const [mutateProduct, { isLoading }] = useMutationRequest<Partial<Product>, Partial<Product>>();

  /**
   * Callbacks
   */
  const handleCloseModal = () => {
    form.setFieldsValue(EMPTY_PRODUCT);
    onCancel?.();
  };

  const handleFinishForm = async ({ id, ...formValues }: Product) => {
    const { error } = await mutateProduct(
      {
        ...product,
        ...formValues,
        name: trim(formValues.name),
        envid: environment.id,
      },
      isNewProduct ? 'POST' : 'PUT',
      `/products${isNewProduct ? '' : `/${id}`}`,
      { injectProject: false }
    );
    if (error) {
      return errorNotification(
        'Products error',
        `Could not ${isNewProduct ? 'create' : 'update'} product`,
        {
          error,
        }
      );
    }

    onCancel?.({ refreshQuery: true });
    form.resetFields();
    return successNotification(
      'Success',
      `Product ${isNewProduct ? 'created' : 'updated'} successfully`
    );
  };

  /**
   * Effects
   */
  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.setFieldsValue(EMPTY_PRODUCT);
    }
  }, [product]);

  /**
   * Conditional rendering
   */
  const isNewProduct = !product?.id;

  return (
    <Modal
      footer={null}
      title={`${isNewProduct ? 'New' : 'Update'} Product`}
      onCancel={handleCloseModal}
      {...props}
    >
      <Form form={form} initialValues={product} onFinish={handleFinishForm} layout='vertical'>
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
          label='URL'
          rules={[
            { required: true, message: 'Please enter a URL' },
            { max: MAX_CHARACTER_LIMIT, message: 'Max character limit reached' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
          name='loginUrl'
        >
          <Input maxLength={MAX_CHARACTER_LIMIT} />
        </Form.Item>
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
        <Form.Item
          label='Profile'
          rules={[{ required: true, message: 'Please enter a profile' }]}
          name='browserProfile'
        >
          <Select placeholder='Choose one'>
            {new Array(10).fill('').map((_, index) => (
              <Select.Option
                key={index}
                value={index.toString()}
              >{`Profile ${index}`}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Space className='flex-end'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            size='large'
            htmlType='submit'
            loading={isLoading}
          >
            {isNewProduct ? 'Add' : 'Update'}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};
