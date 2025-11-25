import { useRef } from 'react';
import { type Table, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UI_TEXT } from '../../constants/strings';

interface DataTableProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
}

export function DataTable<TData>({ table, isLoading }: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div className="table-wrapper" ref={tableContainerRef}>
      <table className="data-table">
        <thead className="table-thead">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="table-th"
                  style={{ width: header.getSize() }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: UI_TEXT.SORT_ASC_ICON,
                    desc: UI_TEXT.SORT_DESC_ICON,
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td
                style={{ height: `${paddingTop}px` }}
                colSpan={table.getAllColumns().length}
              />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                className="table-row"
                style={{
                  height: `${virtualRow.size}px`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="table-cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td
                style={{ height: `${paddingBottom}px` }}
                colSpan={table.getAllColumns().length}
              />
            </tr>
          )}
        </tbody>
      </table>
      {rows.length === 0 && !isLoading && (
        <div className="no-results">{UI_TEXT.NO_RESULTS}</div>
      )}
    </div>
  );
}
