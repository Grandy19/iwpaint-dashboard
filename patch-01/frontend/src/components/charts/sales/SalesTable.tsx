import React from 'react';

export const SalesTable = () => {
  const data = [
    { no: '01', code: 'F092', name: 'Fransiskus', sales: 'Rp1.200.000.000' },
    { no: '02', code: 'J019', name: 'Julianto', sales: 'Rp980.000.000' },
    { no: '03', code: 'S120', name: 'Sadang', sales: 'Rp850.000.000' },
    { no: '04', code: 'K567', name: 'Ken Y', sales: 'Rp700.000.000' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 mb-6 text-lg">Top 10 Sales Berdasarkan Penjualan</h3>
      <div className="overflow-y-auto overflow-x-hidden max-h-[260px] custom-scroll pr-2 flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#fafafa] border-y border-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap">No.</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap">Kode Sales</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap">Sales</th>
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap text-right">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-[#f8f6fb] transition-colors duration-200">
                <td className="py-4 px-6 text-sm text-gray-600 font-medium whitespace-nowrap">{row.no}</td>
                <td className="py-4 px-6 text-sm whitespace-nowrap">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">{row.code}</span>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                <td className="py-4 px-6 text-sm text-gray-900 font-medium whitespace-nowrap text-right">{row.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
