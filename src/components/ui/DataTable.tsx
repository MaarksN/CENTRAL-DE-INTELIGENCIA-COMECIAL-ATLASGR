import React from 'react';

type Column<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
};

export function DataTable<T>({ data, columns, isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-slate-200 shadow-sm animate-pulse">
        <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 border-b border-slate-100 flex items-center px-4">
             <div className="h-4 bg-slate-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey] || '') : null)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
