import React from 'react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  renderCell: (item: any, columnKey: string) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({ title, columns, data, renderCell }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <h3 className="text-gray-600 text-[18px] font-medium mb-6">{title}</h3>
      <div className="overflow-y-auto overflow-x-auto max-h-[300px] pr-2 custom-scroll">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-100 sticky top-0 bg-white z-10">
            <tr>
              <th className="pb-4 font-medium whitespace-nowrap px-1 w-[50px]">No</th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`pb-4 font-medium whitespace-nowrap px-1 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr 
                key={item.id || rowIndex} 
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-1 text-gray-600 font-medium">
                  {rowIndex + 1}
                </td>
                {columns.map((col) => (
                  <td 
                    key={col.key} 
                    className={`py-4 px-1 text-gray-600 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}
                  >
                    {renderCell(item, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
