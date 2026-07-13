import React from 'react';

const data = [
  { name: 'Crystal Coat Thinner', value: 'Rp850.000.000', percentage: 90 },
  { name: 'Wiratex Wall Paint', value: 'Rp800.000.000', percentage: 85 },
  { name: 'Petalac PU Clear', value: 'Rp750.000.000', percentage: 80 },
  { name: 'Shintex Wall Paint', value: 'Rp700.000.000', percentage: 75 },
  { name: 'Crystal Coat Thinner 2', value: 'Rp650.000.000', percentage: 70 },
  { name: 'Cat Dasar 1', value: 'Rp600.000.000', percentage: 65 },
  { name: 'Cat Tembok 2', value: 'Rp550.000.000', percentage: 60 },
  { name: 'Thinner Spesial', value: 'Rp500.000.000', percentage: 55 },
  { name: 'Cat Kayu 1', value: 'Rp450.000.000', percentage: 50 },
  { name: 'Dempul Mobil', value: 'Rp400.000.000', percentage: 45 },
];

export const CustomerTopProductsChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col mb-8 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Top 10 Produk Terlaris</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total:</p>
          <p className="font-bold text-gray-900 text-lg">Rp 2.450.000.000</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scroll pr-4">
        <div className="flex flex-col gap-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-48 text-right shrink-0">
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              
              <div className="flex-1 bg-[#f1f5f9] h-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#38bdf8] rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              
              <div className="w-32 shrink-0">
                <span className="text-sm text-gray-600">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
