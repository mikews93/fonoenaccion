import { TablePaginationConfig } from 'antd';
import { ColumnSortPersistence } from './Table';

export const DEFAULT_PAGINATION: TablePaginationConfig = {
  defaultPageSize: 25,
  position: ['bottomRight'],
  showSizeChanger: true,
};
