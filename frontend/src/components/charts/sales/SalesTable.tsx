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
      <h3 className="font-bold text-gray-900 mb-6">Top 10 Sales Berdasarkan Penjualan</h3>
      <div className="overflow-y-auto overflow-x-hidden max-h-[260px] custom-scroll pr-2 flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b border-gray-100 sticky top-0 bg-white z-10">
            <tr>
              <th className="pb-3 font-normal">No.</th>
              <th className="pb-3 font-normal">Kode Sales</th>
              <th className="pb-3 font-normal">Sales</th>
              <th className="pb-3 font-normal text-right">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 text-gray-500">{row.no}</td>
                <td className="py-4 font-medium text-gray-900">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{row.code}</span>
                </td>
                <td className="py-4 text-gray-600">{row.name}</td>
                <td className="py-4 text-right font-medium text-gray-900">{row.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
