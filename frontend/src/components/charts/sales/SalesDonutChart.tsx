import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Otomotif', value: 3200000000, color: '#3b82f6' },
  { name: 'Dekoratif', value: 2100000000, color: '#ef4444' },
  { name: 'Proyek', value: 1500000000, color: '#eab308' },
  { name: 'Industri', value: 980000000, color: '#a855f7' },
];

export const SalesDonutChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 mb-6">Distribusi Penjualan Berdasarkan Kategori Produk</h3>
      <div className="flex-1 min-h-0 relative flex flex-col">
        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-4 pb-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-400">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
