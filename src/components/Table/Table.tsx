import { Table as AntTable, TableColumnType, TableProps, Typography } from 'antd';
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

// @utils
import { enhanceTableColumns } from 'shared/utils/Table';

// @constants
import { DEFAULT_PAGINATION } from './contants';

// @styles
import styles from './styles.module.scss';

// @types
import { UserType } from 'shared/types/userType';
import { SortOrder } from 'antd/es/table/interface';
import { useColumnSortPersistence } from 'shared/hooks/useColumnSortPersistence';
import { TABLE_KEYS } from 'shared/constants';

const { Title } = Typography;

export enum COLUMN_TYPE {
  BOOLEAN = 'boolean',
  DATE = 'date',
  LANGUAGE = 'language',
  LINK = 'link',
  NUMBER = 'number',
  TEXT = 'text',
  USER = 'user',
}

export interface EnhancedColumn<RecordType> extends TableColumnType<RecordType> {
  columnType?: COLUMN_TYPE;
  sortable?: boolean;
  filterable?: boolean;
}

export type ColumnSort = {
  column: string;
  sortOrder: SortOrder;
};

export type ColumnSortPersistence = {
  [key: string]: ColumnSort;
};

interface CustomTableProps<RecordType> extends Omit<TableProps<RecordType>, 'columns'> {
  tableKey: TABLE_KEYS;
  extra?: ReactNode;
  fillParent?: boolean;
  name?: string;
  onRowClick?: (row: RecordType, rowIndex?: number) => void;
  parentRef?: RefObject<HTMLElement>;
  currentUserName?: UserType['name'];
  columns: EnhancedColumn<RecordType>[];
  textFilter?: string;
  offsetTop?: number;
}

const initialScrollAt = 600;

export const Table = <RecordType extends { id: string | number }>({
  extra,
  tableKey,
  fillParent = true,
  name,
  onRowClick,
  parentRef,
  currentUserName,
  dataSource,
  textFilter,
  offsetTop,
  ...props
}: CustomTableProps<RecordType>) => {
  /**
   * hooks
   */
  const tableRef = useRef<any>();

  /**
   * State
   */
  const [scrollAt, setScrollAt] = useState(initialScrollAt);
  const [records, setRecords] = useState(dataSource);
  const { handleSort, columnsConfig } = useColumnSortPersistence(tableKey, props.columns);

  /**
   * Effects
   */
  useEffect(() => {
    if (fillParent) {
      const paginationMargins = 32;
      if (tableRef.current && offsetTop) {
        const offset = tableRef.current.offsetTop + offsetTop;
        setScrollAt(innerHeight - (offset + paginationMargins));
      } else if (tableRef.current && !offsetTop) {
        setScrollAt(
          tableRef.current.offsetHeight -
            (offsetTop || tableRef.current.offsetTop + paginationMargins)
        );
      } else if (parentRef?.current) {
        const offset = parentRef?.current?.offsetTop + (offsetTop || 0);
        setScrollAt(parentRef.current?.offsetHeight - (offset + paginationMargins));
      }
    }
    return () => {
      setScrollAt(initialScrollAt);
    };
  }, []);

  useEffect(() => {
    if (textFilter && !isEmpty(textFilter)) {
      setRecords(
        dataSource?.filter((item) => {
          return !!Object.values(item).filter((value) =>
            `${value}`.toLowerCase().includes(textFilter.toLowerCase())
          ).length;
        })
      );
    } else {
      setRecords(dataSource);
    }
  }, [textFilter, dataSource]);

  /**
   * Callbacks
   */
  const handleOnRow = (record: RecordType, rowIndex?: number) => {
    return {
      onClick: () => onRowClick?.(record, rowIndex),
      onDoubleClick: () => {},
      onContextMenu: () => {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
    };
  };

  /**
   * Conditional render
   */
  const renderTableHeader = () => {
    if (!name && !extra) {
      return <></>;
    }

    return (
      <div className='space-between'>
        <Title level={4}>{name}</Title>
        {extra}
      </div>
    );
  };

  // This is used to prevent horizontal scrollbar to appear when table is empty
  const scrollX = records?.length ? 'max-content' : undefined;

  return (
    <AntTable<RecordType>
      onChange={handleSort}
      {...props}
      bordered={false}
      className={classNames(props.className, styles.table)}
      columns={enhanceTableColumns<RecordType>(columnsConfig, dataSource, currentUserName)}
      dataSource={records}
      onRow={handleOnRow}
      pagination={DEFAULT_PAGINATION}
      ref={parentRef ? null : tableRef}
      rowKey={props.rowKey ?? 'id'}
      scroll={{ y: scrollAt, x: scrollX }}
      title={name ? renderTableHeader : undefined}
    />
  );
};
