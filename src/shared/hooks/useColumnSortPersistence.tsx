import { useCallback, useMemo } from 'react';
import { TableProps } from 'antd';
import { SortOrder } from 'antd/es/table/interface';

import { useLocalState } from './useLocalState';
import { ColumnSortPersistence, EnhancedColumn } from 'components/Table/Table';
import { useSharedDataContext } from 'shared/context/useSharedData';

export const useColumnSortPersistence = <T extends unknown>(
  tableKey: string,
  columns: EnhancedColumn<T>[]
) => {
  const [sharedData] = useSharedDataContext();
  const key: string = sharedData.selectedClient ? sharedData.selectedClient.toString() : '';
  const [sortState, setSortState] = useLocalState<ColumnSortPersistence>({}, tableKey);

  const handleSort = useCallback<Exclude<TableProps<T>['onChange'], undefined>>(
    (_pagination, _filters, sorter) => {
      if (Array.isArray(sorter) || !key) return;
      setSortState({
        ...sortState,
        [key]: {
          column: sorter.columnKey as string,
          sortOrder: sorter.order as SortOrder,
        },
      });
    },
    [key, sortState]
  );

  const columnsConfig = useMemo(
    () =>
      columns.map((column) => {
        if (column.key && sortState[key] && column.key === sortState[key].column) {
          return {
            ...column,
            defaultSortOrder: sortState[key].sortOrder,
            sortOrder: sortState[key].sortOrder,
          };
        }
        return column;
      }),
    [columns, sortState, key]
  );

  return {
    handleSort,
    columnsConfig,
  };
};
