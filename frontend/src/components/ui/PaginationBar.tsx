import { type Table } from '@tanstack/react-table';
import { UI_TEXT } from '../../constants/strings';

interface PaginationBarProps<TData> {
  table: Table<TData>;
}

export function PaginationBar<TData>({ table }: PaginationBarProps<TData>) {
  return (
    <div className="pagination-bar">
      <button
        className="pagination-btn"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {UI_TEXT.PAGINATION.FIRST}
      </button>
      <button
        className="pagination-btn"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {UI_TEXT.PAGINATION.PREV}
      </button>
      <button
        className="pagination-btn"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {UI_TEXT.PAGINATION.NEXT}
      </button>
      <button
        className="pagination-btn"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {UI_TEXT.PAGINATION.LAST}
      </button>
      <span className="page-info">
        <div>{UI_TEXT.PAGE}</div>
        <strong>
          {table.getState().pagination.pageIndex + 1}
          {UI_TEXT.OF}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
          table.setPageIndex(0);
        }}
        className="page-size-select"
      >
        {[10, 20, 50, 100, 200].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {UI_TEXT.SHOW_PREFIX}
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}
