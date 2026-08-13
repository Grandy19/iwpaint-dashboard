import React from 'react';

export interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right' | string;
  className?: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  renderCell: (item: any, columnKey: string) => React.ReactNode;
  tableLayout?: 'auto' | 'fixed';
  minWidth?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  columns, 
  data, 
  renderCell,
  tableLayout = 'fixed',
  minWidth = 'min-w-full'
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40">
      {title ? <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase mb-6">{title}</h3> : null}
      <div className="overflow-y-auto overflow-x-auto max-h-[300px] custom-scroll">
        <table className={`w-full text-sm text-left ${tableLayout === 'auto' ? '' : 'table-fixed'} ${minWidth}`}>
          <thead className="bg-slate-50 border-y border-slate-100 sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap w-[60px] min-w-[60px]">No</th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-gray-400 font-normal">
                  Tidak ada data yang tersedia
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr 
                  key={item.id || rowIndex} 
                  className="border-b border-gray-50 last:border-0 hover:bg-[#f8f6fb] transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium whitespace-nowrap w-[60px] min-w-[60px]">
                    {rowIndex + 1}
                  </td>
                  {columns.map((col) => (
                    <td 
                      key={col.key} 
                      className={`py-4 px-6 text-sm text-gray-600 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {renderCell(item, col.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
