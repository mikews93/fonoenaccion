import { PicCenterOutlined } from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';
import { ListItemProps } from 'antd/es/list';
import { List, Space } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';

// @styles
import styles from './styles.module.scss';

interface DropListColumnItemProps extends ListItemProps {
  id: string;
  index: number;
  title: string;
}

export const DropListColumnItem: FC<DropListColumnItemProps> = ({ id, index, title }) => (
  <Draggable draggableId={id} index={index}>
    {(provided, snapshot) => (
      <List.Item
        className={classNames(styles.dropListColumnItemProps, {
          [styles.isDragging]: snapshot.isDragging && !snapshot.isDropAnimating,
        })}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Space>
          <PicCenterOutlined />
          {title}
        </Space>
      </List.Item>
    )}
  </Draggable>
);
