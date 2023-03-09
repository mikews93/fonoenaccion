import { DeleteOutlined, EditOutlined, FileSearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Typography } from 'antd';
import { FC, ReactNode, useState } from 'react';
import classNames from 'classnames';

// @components
import { InlineInputForm } from 'components/InlineInputForm/InlineInputForm';
import { InlineInputSearch } from 'components/InlineInputSearch/InlineInputSearch';

// @utils
import { preventDefaultBehavior } from 'shared/utils/Functions';

export interface ActionableHeaderProps {
  associatedEntity?: any;
  className?: string;
  content?: ReactNode;
  deletable?: boolean;
  editable?: boolean;
  extra?: ReactNode;
  onAddNewItem?: (...args: any) => any;
  onDelete?: (...args: any) => any;
  onEditHeader?: (...args: any) => any;
  onSearch?: (...args: any) => any;
  searchable?: boolean;
  showAddBtn?: boolean;
  addBtnTitle?: string;
  searchPlaceholder?: string;
}

enum INPUT_TYPE {
  EDIT = 'edit',
  SEARCH = 'search',
}

const initialInputState = { visible: false, type: INPUT_TYPE.EDIT };

export const ActionableHeader: FC<ActionableHeaderProps> = ({
  associatedEntity,
  className,
  content,
  deletable,
  editable,
  extra,
  onAddNewItem,
  onDelete,
  onEditHeader,
  onSearch,
  searchable,
  showAddBtn,
  addBtnTitle,
  searchPlaceholder = 'Search',
  ...props
}) => {
  /**
   * State
   */
  const [inputFieldState, setInputFieldState] = useState(initialInputState);

  /**
   * handlers
   */
  const handleOk = async (values: any) => {
    await onEditHeader?.({ ...associatedEntity, ...values });
    handleCancel();
  };
  const handleCancel = () => setInputFieldState(initialInputState);
  const handleClickAdd = () => onAddNewItem?.(associatedEntity);
  const handleClickDelete = () => onDelete?.(associatedEntity);
  const handleClickEdit = () => setInputFieldState({ visible: true, type: INPUT_TYPE.EDIT });
  const handleClickSearch = () => setInputFieldState({ visible: true, type: INPUT_TYPE.SEARCH });

  const isStringContent = typeof content === 'string';
  const inputFormDefaultValue = isStringContent ? content : associatedEntity?.name;

  /**
   * Conditional rendering
   */
  const renderInputComponent = {
    [INPUT_TYPE.EDIT]: (
      <InlineInputForm
        onOk={handleOk}
        onCancel={handleCancel}
        defaultValue={inputFormDefaultValue}
      />
    ),
    [INPUT_TYPE.SEARCH]: (
      <InlineInputSearch
        onClose={handleCancel}
        onSearch={onSearch}
        placeholder={searchPlaceholder}
      />
    ),
  };

  return (
    <div className={classNames('space-between align-baseline gp-2', className)} {...props}>
      {inputFieldState.visible ? (
        renderInputComponent[inputFieldState.type]
      ) : (
        <>
          {isStringContent ? <span>{content}</span> : content}
          <div className='flex'>
            {editable && (
              <Button
                icon={<EditOutlined />}
                onClick={handleClickEdit}
                shape='circle'
                size='large'
                type='text'
              />
            )}
            {searchable && (
              <Button
                icon={<FileSearchOutlined />}
                onClick={handleClickSearch}
                shape='circle'
                size='large'
                title='Search'
                type='text'
              />
            )}
            {deletable && (
              <Popconfirm
                placement='bottomLeft'
                title={
                  <Typography.Text>
                    Are you sure to delete <strong>{inputFormDefaultValue}</strong>?
                  </Typography.Text>
                }
                onConfirm={handleClickDelete}
                onCancel={preventDefaultBehavior}
              >
                <Button
                  icon={<DeleteOutlined />}
                  onClick={preventDefaultBehavior}
                  shape='circle'
                  size='large'
                  type='text'
                />
              </Popconfirm>
            )}
            {showAddBtn && (
              <Button
                icon={<PlusOutlined />}
                onClick={handleClickAdd}
                shape='circle'
                size='large'
                type='text'
                title={addBtnTitle}
              />
            )}
            {extra}
          </div>
        </>
      )}
    </div>
  );
};
