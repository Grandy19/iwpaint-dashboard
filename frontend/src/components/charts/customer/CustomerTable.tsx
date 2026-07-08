import React from 'react';

export const CustomerTable = () => {
  const data = [
    { no: '01', code: 'CT123', name: 'PT AKD', sales: 'Rp1.200.000.000' },
    { no: '02', code: 'CT123', name: 'SUMBER JAYA', sales: 'Rp980.000.000' },
    { no: '03', code: 'CT123', name: 'TB SKJ', sales: 'Rp850.000.000' },
    { no: '04', code: 'CT123', name: 'TB. PRIBUMI RJ', sales: 'Rp700.000.000' },
    { no: '05', code: 'CT124', name: 'MITRA ABADI', sales: 'Rp650.000.000' },
    { no: '06', code: 'CT125', name: 'CV SUKSES', sales: 'Rp500.000.000' },
    { no: '07', code: 'CT126', name: 'PT MAKMUR', sales: 'Rp420.000.000' },
    { no: '08', code: 'CT127', name: 'TB JAYA RAYA', sales: 'Rp380.000.000' },
    { no: '09', code: 'CT128', name: 'CAHAYA ABADI', sales: 'Rp290.000.000' },
    { no: '10', code: 'CT129', name: 'BINTANG PAINT', sales: 'Rp210.000.000' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 mb-6">Top 10 Customer Berdasarkan Penjualan</h3>
      <div className="overflow-y-auto overflow-x-hidden max-h-[260px] custom-scroll pr-2 flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b border-gray-100 sticky top-0 bg-white z-10">
            <tr>
              <th className="pb-3 font-normal">No.</th>
              <th className="pb-3 font-normal">Kode Customer</th>
              <th className="pb-3 font-normal">Customer</th>
              <th className="pb-3 font-normal text-right">Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-gray-600">{item.no}</td>
                <td className="py-3 text-gray-500">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{item.code}</span>
                </td>
                <td className="py-3 font-medium text-gray-900">{item.name}</td>
                <td className="py-3 text-right">{item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
