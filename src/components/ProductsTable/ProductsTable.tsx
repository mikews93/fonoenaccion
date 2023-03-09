import { Button, Popconfirm, TableProps, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { FC, MouseEvent, useEffect, useState } from 'react';

// @components
import { ProductModal, ProductModalProps } from 'components/ProductModal/ProductModal';
import { COLUMN_TYPE, EnhancedColumn, Table } from 'components/Table/Table';

// @hooks
import { useGetRequest, useMutationRequest } from 'shared/hooks/useRequest';
import { useNotifications } from 'shared/hooks/useNotifications';
import { useSharedDataContext } from 'shared/context/useSharedData';

// @types
import { EnvironmentTabItem } from 'components/EnvironmentTabs/EnvironmentTabs';
import { Product } from 'shared/types/Products';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';
import { generateSlug, maskPasswordGenerator } from 'shared/utils/Strings';
import { TABLE_KEYS } from 'shared/constants';

// @styles
import styles from './styles.module.scss';

interface ProductsTableProps extends EnvironmentTabItem, TableProps<any> {
  // * productTable specific props
}

const productModalInitialState: Partial<ProductModalProps> = {
  open: false,
  product: undefined,
};

export const ProductsTable: FC<ProductsTableProps> = ({
  environment,
  showAddNewRecordModal,
  setShowAddNewRecordModal,
  ...tableProps
}) => {
  if (!environment) {
    return null;
  }
  /**
   * hooks
   */
  const { errorNotification, successNotification } = useNotifications();
  const [{ theme }] = useSharedDataContext();

  /**
   * Queries
   */
  const [products, { isLoading, mutate }] = useGetRequest<Product[]>(
    `/environments/${environment.id}/products`,
    null
  );
  const [mutateProduct] = useMutationRequest<Partial<Product> | null, Partial<Product>>();

  /**
   * state
   */
  const [productModalState, setProductModalState] = useState(productModalInitialState);
  /**
   * Effects
   */
  useEffect(() => {
    if (showAddNewRecordModal) {
      handleClickNewProduct();
    } else {
      handleCloseProductModal();
    }
  }, [showAddNewRecordModal]);

  /**
   * handlers
   */
  const handleClickNewProduct = () => setProductModalState((state) => ({ ...state, open: true }));
  const handleCloseProductModal = (args?: any) => {
    setProductModalState(productModalInitialState);
    setShowAddNewRecordModal(false);

    if (args?.refreshQuery) {
      mutate([]);
    }
  };
  const handleMarkDefault = async (product: Product) => {
    const { error } = await mutateProduct(
      { ...product, defaultTab: true, envid: environment.id },
      'PUT',
      `/products/${product.id}`,
      { injectProject: false }
    );
    if (error) {
      return errorNotification('Product error', 'Could not mark Product as default', { error });
    }

    mutate([]);
    return successNotification(
      'Awesome!',
      <div>
        Product <strong>{product.name}</strong> marked as default
      </div>
    );
  };
  const handleEditProduct = (product: Product) => setProductModalState({ open: true, product });
  const handleDeleteProduct = async (product: Product) => {
    const { error } = await mutateProduct(null, 'DELETE', `/products/${product.id}`);
    if (error) {
      return errorNotification('Product error', 'Could not delete Product', { error });
    }

    mutate([]);
    return successNotification(
      'Awesome!',
      <div>
        Product <strong>{product.name}</strong> deleted successfully
      </div>
    );
  };

  /**
   * Conditional renders
   */
  const columns: EnhancedColumn<Product>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (value, row) => (
        <div className='flex gp-2 align-center'>
          {row.defaultTab && <StarFilled style={{ color: theme?.colorPrimary }} />} {value}
        </div>
      ),
      className: styles.nameColumn,
    },
    {
      key: 'loginUrl',
      title: 'URL',
      dataIndex: 'loginUrl',
      width: '30%',
      columnType: COLUMN_TYPE.LINK,
      className: styles.linkColumn,
    },
    {
      key: 'language',
      title: 'Username',
      dataIndex: 'username',
      className: styles.userColumn,
    },
    {
      key: 'language',
      title: 'Password',
      dataIndex: 'password',
      render: (_, { username }) => <div>{username ? maskPasswordGenerator(8) : username}</div>,
      className: styles.passwordColumn,
    },
    {
      key: 'browserProfile',
      title: 'Profile',
      dataIndex: 'browserProfile',
      render: (value: number) => <div>{`Profile ${value}`}</div>,
      className: styles.profileColumn,
    },
    {
      width: 100,
      render: (_, row) => {
        const onClickMarkDefault = () => handleMarkDefault(row);
        const onClickEdit = () => handleEditProduct(row);
        const onConfirmDelete = (event?: MouseEvent<HTMLElement>) => {
          preventDefaultBehavior(event);
          handleDeleteProduct(row);
        };

        const actions = [
          <Button
            key={generateSlug()}
            type='text'
            icon={<EditOutlined />}
            title='Edit'
            onClick={onClickEdit}
            shape='circle'
          />,
          <Popconfirm
            placement='bottomLeft'
            key={generateSlug()}
            title={
              <Typography.Text>
                Are you sure to delete <strong>{row.name}</strong>?
              </Typography.Text>
            }
            onConfirm={onConfirmDelete}
            onCancel={preventDefaultBehavior}
          >
            <Button
              type='text'
              icon={<DeleteOutlined />}
              title='Delete'
              onClick={preventDefaultBehavior}
              shape='circle'
            />
          </Popconfirm>,
        ];

        if (!row.defaultTab) {
          actions.splice(
            0,
            0,
            <Button
              key={generateSlug()}
              type='text'
              icon={<StarOutlined />}
              title='Mark as default'
              onClick={onClickMarkDefault}
              shape='circle'
            />
          );
        }

        return <div className='flex-end'>{actions}</div>;
      },
    },
  ];

  /**
   * This variable if used to help table component to scroll at
   * the maximum container height, the scrollAt property from table component
   * is calculated on component mount so is not adjustable with css therefore
   * it relies on javascript component provided dimensions which is not always accurate
   */
  const additionalOffset = 240;

  return (
    <>
      <Table<Product>
        {...tableProps}
        tableKey={TABLE_KEYS.PRODUCTS}
        columns={columns}
        dataSource={products}
        loading={isLoading}
        offsetTop={additionalOffset}
      />
      <ProductModal
        {...productModalState}
        environment={environment}
        onCancel={handleCloseProductModal}
      />
    </>
  );
};
