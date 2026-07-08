import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value1: 400000000, value2: 1200000000 },
  { name: 'Feb', value1: 900000000, value2: 300000000 },
  { name: 'Mar', value1: 1200000000, value2: 800000000 },
  { name: 'Apr', value1: 1500000000, value2: 2500000000 },
  { name: 'Mei', value1: 2500000000, value2: 1500000000 },
  { name: 'Jun', value1: 3800000000, value2: 4000000000 }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2">
        {payload.map((entry: any, index: number) => {
          const isBlue = entry.dataKey === 'value1';
          const bgColor = isBlue ? 'bg-[#e0f2fe]' : 'bg-[#ffe4e6]';
          const textColor = isBlue ? 'text-[#0284c7]' : 'text-[#e11d48]';
          const formattedValue = new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
          }).format(entry.value);
          
          return (
            <div key={index} className={`${bgColor} px-3 py-1 rounded shadow-sm`}>
              <p className={`${textColor} text-xs font-semibold`}>{formattedValue}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const TrendLineChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[350px] flex flex-col mb-8">
      <h3 className="font-bold text-gray-900 mb-6">Tren Penjualan</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide domain={[0, 6000000000]} />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#38bdf8', strokeDasharray: '3 3' }}
              position={{ y: -10 }}
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
              stroke="#fb7185" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#fb7185', stroke: '#fff', strokeWidth: 2 }} 
            />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#38bdf8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
