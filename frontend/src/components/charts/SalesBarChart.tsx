import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Rudi', value: 400000000 },
  { name: 'Frans', value: 150000000 },
  { name: 'Budi', value: 100162800 },
  { name: 'Santoso', value: 300000000 },
  { name: 'Heru', value: 250000000 },
  { name: 'Vivi', value: 320000000 },
  { name: 'Ariq', value: 290000000 },
  { name: 'Heri', value: 310000000 },
  { name: 'Dinda', value: 90000000 },
  { name: 'Asep', value: 420000000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedValue = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(payload[0].value);

    return (
      <div className="bg-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-50">
        <p className="text-gray-900 font-bold text-sm mb-1">{label}</p>
        <p className="text-gray-400 text-xs font-medium">{formattedValue}</p>
      </div>
    );
  }
  return null;
};

export const SalesBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
      >
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
          dy={10}
        />
        {/* Hide Y Axis entirely */}
        <YAxis hide />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          fill="#9a2769" 
          radius={[10, 10, 10, 10]} 
          barSize={12} 
          background={{ fill: '#f1f5f9', radius: 10 }} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
