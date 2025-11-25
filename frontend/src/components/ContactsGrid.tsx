import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import debounce from 'lodash.debounce';
import { useContacts } from '../hooks/useContacts';
import type { Contact, ContactsParams } from '../api/contactsApi';
import { UI_TEXT, COLUMNS } from '../constants/strings';
import { GridToolbar } from './ui/GridToolbar';
import { DataTable } from './ui/DataTable';
import { PaginationBar } from './ui/PaginationBar';

export const ContactsGrid: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const queryParams: ContactsParams = {
    q: search,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortDir: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  };

  const { data, isLoading, isError } = useContacts(queryParams);

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      { accessorKey: COLUMNS.ID.KEY, header: COLUMNS.ID.HEADER, size: 60 },
      { accessorKey: COLUMNS.FIRST_NAME.KEY, header: COLUMNS.FIRST_NAME.HEADER },
      { accessorKey: COLUMNS.LAST_NAME.KEY, header: COLUMNS.LAST_NAME.HEADER },
      { accessorKey: COLUMNS.EMAIL.KEY, header: COLUMNS.EMAIL.HEADER },
      { accessorKey: COLUMNS.PHONE.KEY, header: COLUMNS.PHONE.HEADER },
      { accessorKey: COLUMNS.CITY.KEY, header: COLUMNS.CITY.HEADER },
      { accessorKey: COLUMNS.STATE.KEY, header: COLUMNS.STATE.HEADER, size: 60 },
      { accessorKey: COLUMNS.STATUS.KEY, header: COLUMNS.STATUS.HEADER, size: 80 },
    ],
    []
  );

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    pageCount: data && data.pageSize > 0 ? Math.ceil(data.totalCount / data.pageSize) : -1,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  if (isError) return <div>{UI_TEXT.ERROR_LOADING}</div>;

  return (
    <div className="grid-container">
      <GridToolbar
        onSearch={handleSearchChange}
        isLoading={isLoading}
        totalCount={data?.totalCount ?? 0}
      />

      <DataTable table={table} isLoading={isLoading} />

      <PaginationBar table={table} />
    </div>
  );
};