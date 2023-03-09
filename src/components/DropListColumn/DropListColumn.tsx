import { DropListColumnItem } from 'components/DropListColumnItem/DropListColumnItem';
import { List, ListProps } from 'antd';
import classNames from 'classnames';

// @components
import { Droppable } from 'components/Droppable/Droppable';
import {
  ActionableHeader,
  ActionableHeaderProps,
} from 'components/ActionableHeader/ActionableHeader';

// @styles
import styles from './styles.module.scss';

interface DropListColumnProps<T> extends ListProps<T> {
  headerProps?: ActionableHeaderProps;
  droppableId: string;
  type: string;
}

interface itemProps {
  id: string;
  name: string;
}

export const DropListColumn = <T extends itemProps>({
  droppableId,
  dataSource = [],
  type,
  className,
  headerProps,
  ...props
}: DropListColumnProps<T>) => (
  <Droppable droppableId={droppableId} type={type}>
    {(provided) => (
      <div
        {...provided.droppableProps}
        ref={provided.innerRef}
        className={classNames(styles.dropListColumn, className)}
      >
        <List<T>
          {...props}
          className={className}
          header={
            <ActionableHeader {...headerProps} content={props.header ?? headerProps?.content} />
          }
        >
          {dataSource.map((item, index) => (
            <DropListColumnItem id={item.id} key={item.id} index={index} title={item.name} />
          ))}

          {provided.placeholder}
        </List>
      </div>
    )}
  </Droppable>
);
