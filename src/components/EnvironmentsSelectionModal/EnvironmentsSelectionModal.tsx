import classNames from 'classnames';
import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { InputRef, List, Modal, ModalProps } from 'antd';

// @components
import { SearchBox } from 'components/SearchBox/SearchBox';

// @hooks
import { useGetRequest } from 'shared/hooks/useRequest';

// @types
import { Environment } from 'shared/types/environments';

// @styles
import styles from './styles.module.scss';

interface EnvironmentsSelectionModalProps extends ModalProps {
  onSelect: (environmentId: Environment['id']) => void;
}

export const EnvironmentsSelectionModal: FC<EnvironmentsSelectionModalProps> = ({
  onOk,
  className,
  okText = 'Select',
  onSelect,
  ...props
}) => {
  /**
   * hooks
   */
  const searchRef = useRef<InputRef>(null);
  /**
   * queries
   */
  const [environments, { isLoading }] = useGetRequest<Environment[]>('/environments');

  /**
   * state
   */
  const [selectedEnvironment, setSelectedEnvironment] = useState<Environment['id'] | null>(null);
  const [searchableEnvironments, setSearchableEnvironments] = useState<Environment[]>([]);

  /**
   * Effects
   */
  useEffect(() => {
    setSearchableEnvironments(environments);
  }, [environments]);
  useEffect(() => {
    if (props.open) {
      setTimeout(() => searchRef.current?.focus(), 500);
    } else {
      setSelectedEnvironment(null);
    }
  }, [props.open]);

  /**
   * callbacks
   */
  const handleSelectEnvironment = (environmentId: Environment['id']) => {
    setSelectedEnvironment(environmentId);
  };
  const handleSearchEnvironment = useCallback(
    (searchText: string = '') =>
      setSearchableEnvironments(
        environments.filter(({ name }) => name.toLowerCase().includes(searchText.toLowerCase()))
      ),
    [environments]
  );

  const handleOkClick = (event: MouseEvent<HTMLElement>) => {
    if (selectedEnvironment) {
      onSelect(selectedEnvironment);
      props.onCancel?.(event);
    }
  };
  return (
    <Modal
      className={classNames(styles.modal, className)}
      title='Choose Environment'
      onOk={handleOkClick}
      okText={okText}
      okButtonProps={{ disabled: !selectedEnvironment, size: 'large' }}
      cancelButtonProps={{ size: 'large' }}
      {...props}
    >
      <SearchBox
        ref={searchRef}
        className={styles.searchInput}
        onSearch={handleSearchEnvironment}
        placeholder='Search Environments'
      />
      <List
        loading={isLoading}
        className={styles.list}
        itemLayout='horizontal'
        dataSource={searchableEnvironments}
        renderItem={({ id, name }) => {
          const handleItemClick = () => handleSelectEnvironment(id);
          return (
            <List.Item
              key={id}
              className={classNames(styles.item, { [styles.selected]: selectedEnvironment === id })}
              onClick={handleItemClick}
            >
              {name}
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};
