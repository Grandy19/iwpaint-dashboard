import React from 'react';

export const SalesTransactionTable = () => {
  const data = [
    { date: '01/05/2026', invoice: '261.000023', customer: 'SUMBER JAYA', product: 'Crystal Coat Thinner 1 LITER', qty: 24, unit: 'KL', total: 'Rp 1.162.800' },
    { date: '01/05/2026', invoice: '261.000024', customer: 'SUMBER JAYA', product: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 1, unit: 'PL', total: 'Rp 360.750' },
    { date: '01/05/2026', invoice: '261.000025', customer: 'Kriya Nusa', product: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 12, unit: 'KL', total: 'Rp 594.000' },
    { date: '30/04/2026', invoice: '261.000021', customer: 'Kriya Nusa', product: 'Petalac 2K PU Hardener', qty: 1, unit: 'GL', total: 'Rp 360.750' },
    { date: '30/04/2026', invoice: '261.000021', customer: 'Kriya Nusa', product: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 24, unit: 'KL', total: 'Rp 1.162.800' },
    { date: '29/04/2026', invoice: '261.000020', customer: 'PT AKD', product: 'Shintex Wall Paint', qty: 10, unit: 'PL', total: 'Rp 1.500.000' },
    { date: '29/04/2026', invoice: '261.000019', customer: 'TB SKJ', product: 'Crystal Coat Thinner 1 LITER', qty: 5, unit: 'KL', total: 'Rp 250.000' },
    { date: '28/04/2026', invoice: '261.000018', customer: 'SUMBER JAYA', product: 'Petalac PU Clear', qty: 2, unit: 'GL', total: 'Rp 700.000' },
    { date: '28/04/2026', invoice: '261.000017', customer: 'PT AKD', product: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 5, unit: 'PL', total: 'Rp 1.800.000' },
    { date: '27/04/2026', invoice: '261.000016', customer: 'Kriya Nusa', product: 'Shintex Wall Paint', qty: 15, unit: 'KL', total: 'Rp 2.250.000' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col mb-8 h-[400px]">
      <h3 className="font-bold text-gray-900 mb-6">Tabel Transaksi Sales</h3>
      <div className="overflow-y-auto custom-scroll pr-2 flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 border-b border-gray-100 sticky top-0 bg-white z-10 text-xs">
            <tr>
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">No. Faktur</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Produk</th>
              <th className="pb-3 font-medium">QTY</th>
              <th className="pb-3 font-medium">Satuan</th>
              <th className="pb-3 font-medium text-right">Total Penjualan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 text-gray-600">{row.date}</td>
                <td className="py-4 font-medium text-gray-900">{row.invoice}</td>
                <td className="py-4 text-gray-600">{row.customer}</td>
                <td className="py-4 text-gray-600">{row.product}</td>
                <td className="py-4 text-gray-600">{row.qty}</td>
                <td className="py-4 text-gray-600">{row.unit}</td>
                <td className="py-4 text-right font-medium text-gray-900">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
