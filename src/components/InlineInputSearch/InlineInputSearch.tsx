import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import Input, { InputProps } from 'antd/es/input/Input';
import { useEscape } from 'shared/utils/Miscellaneous';
import { ChangeEvent, FC } from 'react';
import { Button } from 'antd';

// @styles
import styles from './styles.module.scss';

interface InlineInputInputProps extends InputProps {
  onClose?: (...args: any) => any;
  onSearch?: (...args: any) => any;
}

export const InlineInputSearch: FC<InlineInputInputProps> = ({ onClose, onSearch, ...props }) => {
  /**
   * Handlers
   */
  const handleChangeInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    onSearch?.(value);
  };
  const handleClose = () => {
    onSearch?.('');
    onClose?.();
  };

  /**
   * hooks
   */
  useEscape(handleClose);

  return (
    <div className={styles.inlineInputSearch}>
      <Input
        prefix={<SearchOutlined />}
        onChange={handleChangeInput}
        bordered={false}
        autoFocus
        {...props}
      />
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        shape='circle'
        size='small'
        type='text'
      />
    </div>
  );
};
