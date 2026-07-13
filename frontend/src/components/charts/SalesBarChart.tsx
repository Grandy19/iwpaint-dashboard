import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Budi', value: 450000000 },
  { name: 'Rudi', value: 410000000 },
  { name: 'Frans', value: 380000000 },
  { name: 'Santoso', value: 350000000 },
  { name: 'Heru', value: 320000000 },
  { name: 'Vivi', value: 290000000 },
  { name: 'Ariq', value: 270000000 },
  { name: 'Simon', value: 250000000 },
  { name: 'Dinda', value: 220000000 },
  { name: 'Ningsih', value: 200000000 },
  { name: 'Asep', value: 180000000 },
  { name: 'Herman', value: 150000000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const formattedValue = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(payload[0].value);

    return (
      <div className="relative">
        <div className="bg-white px-5 py-3 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col z-10 relative">
          <p className="text-[#334155] text-sm font-bold mb-1">{label}</p>
          <p className="text-[#94a3b8] text-xs font-medium">{formattedValue}</p>
        </div>
      </div>
    );
  }
  return null;
};

export const SalesBarChart = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
      >
        <XAxis 
          dataKey="name" 
          axisLine={{ stroke: '#f1f5f9', strokeWidth: 2 }}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
          dy={15}
        />
        <YAxis hide />
        <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} offset={20} />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 4, 4]} 
          barSize={32} 
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={activeIndex === index ? '#9a2769' : '#e0c2d8'}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="transition-colors duration-300 cursor-pointer"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
