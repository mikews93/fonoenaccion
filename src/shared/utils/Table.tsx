import moment from 'moment';
import { ReactNode } from 'react';
import { Space, TableProps } from 'antd';
import { isEmpty, sortBy } from 'lodash';

// @types
import { DataIndex } from 'rc-table/lib/interface';
import { UserType } from 'shared/types/userType';
import { SortOrder } from 'antd/es/table/interface';

// @components
import { UserColumn } from 'components/UserColumn/UserColumn';
import { DialectPill } from 'components/DialectPill/DialectPill';
import { LabelLink } from 'components/LableLink/LabelLink';
import { COLUMN_TYPE, EnhancedColumn } from 'components/Table/Table';

// @constants
import { DATE_FORMAT } from 'shared/constants';

// @utils
import { hasOwnProperty } from './Objects';
import { formatDate } from './Date';

/**
 * Adds an extra layer of functionality to add common filters, sorters, renders and other functionality
 * @param columns Array of column config
 * @param dataSource Data to display on the table
 * @param username current user logged in
 * @returns EnhancedColumns
 */
export const enhanceTableColumns = <RecordType extends { [key: string | number]: any }>(
  columns?: EnhancedColumn<RecordType>[],
  dataSource?: TableProps<RecordType>['dataSource'],
  username?: string
): EnhancedColumn<RecordType>[] | undefined => {
  if (!columns || !columns.length) {
    return columns;
  }

  return columns.map(
    ({
      dataIndex,
      sortable = true,
      filterable = false,
      columnType = COLUMN_TYPE.TEXT,
      key,
      ...column
    }) => {
      if (key === 'actions') {
        return column;
      }

      if (sortable) {
        const sortProps = getDefaultSortProps(dataIndex, columnType);
        column.sorter = sortProps.sorter;
        column.sortDirections = sortProps.sortDirections;
      }

      if (filterable) {
        const filterProps = getDefaultFilterProps(dataIndex, columnType, dataSource, username);
        column.onFilter = filterProps.onFilter;
        column.filters = filterProps.filters;
        column.filterSearch = true;
      }

      column.render = column.render ?? getDefaultRender(columnType);

      return { ...column, dataIndex, key };
    }
  );
};

/**
 * Determines how to render a cell depending on the column type
 * @param type COLUMN_TYPE
 * @returns ReactNode
 */
const getDefaultRender = <RecordType,>(
  type?: COLUMN_TYPE
): ((value: any, record: RecordType, index: number) => ReactNode) | undefined => {
  switch (type) {
    case COLUMN_TYPE.USER:
      return (value) => <UserColumn user={{ fullName: value } as UserType} />;
    case COLUMN_TYPE.DATE:
      return (value: string) => formatDate(value);
    case COLUMN_TYPE.LANGUAGE:
      return (languages: string) => {
        const dialects = languages?.split(',');
        if (dialects?.length) {
          const [first, second, ...rest] = dialects;
          return (
            <Space style={{ flexWrap: 'wrap' }}>
              {first && <DialectPill dialect={first} />}
              {second && <DialectPill dialect={second} />}
              {rest && rest.length === 1 && <DialectPill dialect={rest.shift()} />}
              {rest && rest.length > 1 && <DialectPill dialect={`+${rest.length}`} all />}
            </Space>
          );
        } else {
          return <DialectPill all />;
        }
      };
    case COLUMN_TYPE.LINK:
      return (value: string) => <LabelLink>{value}</LabelLink>;
    default:
      return (value) => value;
  }
};

/**
 * Determines how to sort properties depending on the column type
 * @param dataIndex
 * @param type
 * @returns
 */
const getDefaultSortProps = <RecordType,>(dataIndex?: DataIndex, type?: COLUMN_TYPE) =>
  typeof dataIndex === 'string'
    ? {
        onFilter: (value: string | number | boolean, record: RecordType): boolean => {
          if (record && hasOwnProperty(record, dataIndex)) {
            return record[dataIndex] === value;
          } else {
            return false;
          }
        },
        sorter: (a: RecordType, b: RecordType) => {
          if (
            a &&
            b &&
            typeof a === 'object' &&
            typeof b === 'object' &&
            hasOwnProperty(a, dataIndex) &&
            hasOwnProperty(b, dataIndex)
          ) {
            switch (type) {
              case COLUMN_TYPE.DATE:
                return moment(a[dataIndex], DATE_FORMAT).diff(moment(b[dataIndex], DATE_FORMAT));
              case COLUMN_TYPE.TEXT:
              default:
                return a[dataIndex]?.localeCompare?.(b[dataIndex]);
            }
          } else {
            return -1;
          }
        },
        sortDirections: ['descend', 'ascend'] as SortOrder[],
      }
    : {};

/**
 * Generates a filter for ant table component
 * @param dataIndex
 * @param type
 * @param dataSource
 * @param username
 * @returns Function
 */
const getDefaultFilterProps = <RecordType extends { [key: string | number]: any }>(
  dataIndex?: DataIndex,
  type?: COLUMN_TYPE,
  dataSource?: TableProps<RecordType>['dataSource'],
  username?: string
) =>
  typeof dataIndex === 'string'
    ? {
        onFilter: (value: string | number | boolean, record: RecordType): boolean => {
          if (record && hasOwnProperty(record, dataIndex)) {
            return record[dataIndex] === value;
          } else {
            return false;
          }
        },
        filters: sortBy(
          [...new Set(dataSource?.map((item) => item[dataIndex]))].map((value) => ({
            value,
            text: getFilterTextValue(value, type, username),
          })),
          'text'
        ),
      }
    : {};

/**
 * Determines how the text values will be filtered depending on the column type
 * @param value
 * @param type
 * @param username
 * @returns String
 */
const getFilterTextValue = (value: any, type?: COLUMN_TYPE, username?: string): string => {
  switch (type) {
    case COLUMN_TYPE.USER:
      return isEmpty(value) ? '-' : value === username ? 'Me' : value;
    default:
      return value;
  }
};
