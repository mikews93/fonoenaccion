import { createElement, ReactNode, useEffect, useState } from 'react';
import { List, ListProps } from 'antd';
import classNames from 'classnames';

// @components
import { InlineInputForm, InlineInputFromProps } from 'components/InlineInputForm/InlineInputForm';
import {
  ActionableHeader,
  ActionableHeaderProps,
} from 'components/ActionableHeader/ActionableHeader';

// @utils
import { generateSlug } from 'shared/utils/Strings';

// @styles
import styles from './styles.module.scss';

interface itemProps {
  id?: number;
  name?: string;
}

interface NewItemProps extends InlineInputFromProps {
  visible?: boolean;
}

interface ComponentListProps<T> extends ListProps<T> {
  selectedItem?: itemProps;
  headerProps?: ActionableHeaderProps;
  newItemProps?: NewItemProps;
  itemActions?: (item: T) => ReactNode[];
  onClickAddNewItem?: (...args: any) => any;
  onClickItem?: (...args: any) => any;
  selectable?: boolean;
  isDataLoading?: boolean;
}

export const ComponentList = <T extends itemProps>({
  dataSource,
  selectedItem,
  extra,
  itemActions,
  onClickAddNewItem,
  onClickItem,
  selectable = true,
  isDataLoading,
  newItemProps: { visible: showNewItem, ...newItemProps } = {},
  className,
  headerProps,
  ...props
}: ComponentListProps<T>) => {
  /**
   * State
   */
  const [selected, setSelected] = useState<itemProps | undefined>(selectedItem);

  /**
   * Effects
   */

  useEffect(() => {
    setSelected(selectedItem);
  }, [selectedItem]);

  /**
   * Conditional rendering
   */
  const renderItem = ({ id, name, ...rest }: T) => {
    const handleItemClick = () => {
      if (!selectedItem) {
        setSelected({ id, name, ...rest });
      }
      onClickItem?.({ id, name, ...rest });
    };

    // @ts-ignore
    return createElement(
      List.Item,
      {
        actions: itemActions?.({ id, name, ...rest } as T),
        className: classNames(styles.listItem, {
          [styles.selected]: selected?.id === id && selectable,
        }),
        id: id?.toString(),
        key: id,
        onClick: handleItemClick,
      },
      <div className="truncate-text">{name}</div>
    );
  };

  return createElement(List<T>, {
    bordered: true,
    className: classNames(styles.componentList, className),
    itemLayout: 'horizontal',
    loading: isDataLoading,
    children: [
      showNewItem && <InlineInputForm key={generateSlug()} {...newItemProps} />,
      ...(dataSource?.map(renderItem) || []),
    ],
    header: <ActionableHeader {...headerProps} content={props.header ?? headerProps?.content} />,
    ...props,
  });
};
