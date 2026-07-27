import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', value1: 200, value2: 100 },
  { name: 'Feb', value1: 300, value2: 250 },
  { name: 'Mar', value1: 150, value2: 200 },
  { name: 'Apr', value1: 280, value2: 450 },
  { name: 'May', value1: 350, value2: 300 },
  { name: 'Jun', value1: 520, value2: 200 },
  { name: 'Jul', value1: 400, value2: 250 },
  { name: 'Aug', value1: 280, value2: 350 },
  { name: 'Sept', value1: 250, value2: 450 },
  { name: 'Oct', value1: 300, value2: 200 },
  { name: 'Nov', value1: 320, value2: 350 },
  { name: 'Des', value1: 300, value2: 400 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2">
        {payload.map((entry: any, index: number) => {
          const isBlue = entry.dataKey === 'value1';
          const bgColor = isBlue ? 'bg-[#e0f2fe]' : 'bg-[#ffe4e6]';
          const textColor = isBlue ? 'text-[#0284c7]' : 'text-[#e11d48]';
          const formatValue = (val: number) => `Rp${(val * 1000000).toLocaleString('id-ID')}`;

          return (
            <div key={index} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${bgColor} ${textColor} shadow-sm`}>
              {formatValue(entry.value)}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const SalesTrendChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 h-[350px] flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6 text-lg">Tren Penjualan Sales</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#38bdf8" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#f43f5e" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
