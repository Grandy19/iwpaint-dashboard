import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value1: 400, value2: 600 },
  { name: 'Feb', value1: 800, value2: 300 },
  { name: 'Mar', value1: 200, value2: 400 },
  { name: 'Apr', value1: 500, value2: 800 },
  { name: 'Mei', value1: 900, value2: 600 },
  { name: 'Jun', value1: 1000, value2: 1200 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col gap-2">
        {payload.map((entry: any, index: number) => {
          const isBlue = entry.dataKey === 'value2';
          const bgColor = isBlue ? 'bg-[#e0f2fe]' : 'bg-[#ffe4e6]';
          const textColor = isBlue ? 'text-[#0284c7]' : 'text-[#e11d48]';
          // Mocking value for demonstration
          const displayValue = isBlue ? 'Rp520.000.000' : 'Rp200.000.000';
          
          return (
            <div key={index} className={`${bgColor} px-3 py-1 rounded shadow-sm`}>
              <p className={`${textColor} text-xs font-semibold`}>{displayValue}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const CustomerTrendChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[350px] flex flex-col mb-8">
      <h3 className="font-bold text-gray-900 mb-6 text-lg">Tren Pembelian Customer</h3>
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
            <YAxis hide domain={[0, 1500]} />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#38bdf8', strokeDasharray: '3 3' }}
              position={{ y: -10 }}
            />
            <Line 
              type="monotone" 
              dataKey="value1" 
              stroke="#fb7185" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#fb7185', stroke: '#fff', strokeWidth: 2 }} 
            />
            <Line 
              type="monotone" 
              dataKey="value2" 
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
