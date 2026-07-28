import React, { useState } from 'react';

interface ProductItem {
  id: number;
  name: string;
  salesValue: number;
  qtyValue: number;
}

interface TopProductsCardProps {
  data: ProductItem[];
  title?: string;
}

export const TopProductsCard: React.FC<TopProductsCardProps> = ({ data, title = "Top 10 Produk Terlaris Penjualan Customer" }) => {
  const [filterType, setFilterType] = useState<'sales'|'qty'>('sales');

  const maxVal = data.length > 0 ? Math.max(...data.map(p => filterType === 'sales' ? p.salesValue : p.qtyValue)) : 1;
  const totalVal = data.reduce((acc, p) => acc + (filterType === 'sales' ? p.salesValue : p.qtyValue), 0);

  const formatValue = (val: number, type: 'sales' | 'qty') => {
    if (type === 'qty') return `${val.toLocaleString('id-ID')} Kg`;
    return val >= 1e6 ? `Rp ${(val / 1e6).toFixed(1)} Jt` : `Rp ${val.toLocaleString('id-ID')}`;
  };

  const sortedData = [...data].sort((a, b) => (filterType === 'sales' ? b.salesValue - a.salesValue : b.qtyValue - a.qtyValue));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-8">
        <h3 className="text-gray-600 text-[18px] font-medium">{title}</h3>
        <div className="flex items-center gap-6">
          <div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as 'sales' | 'qty')}
              className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3b0764]"
            >
              <option value="sales">Total Penjualan</option>
              <option value="qty">Total QTY</option>
            </select>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1 font-medium">Total:</div>
            <div className="font-bold text-[#1e293b] text-[20px]">{formatValue(totalVal, filterType)}</div>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex flex-col gap-8 max-h-[340px] overflow-y-auto custom-scroll pr-4">
        {sortedData.map((item) => {
          const val = filterType === 'sales' ? item.salesValue : item.qtyValue;
          const percentage = maxVal > 0 ? (val / maxVal) * 100 : 0;
          return (
            <div key={item.id} className="flex items-center gap-6">
              <div className="w-[180px] text-sm text-[#475569] font-medium text-right shrink-0">
                {item.name}
              </div>
              
              <div className="flex-1 relative h-[16px]">
                {/* Background Bar */}
                <div className="absolute top-0 left-0 w-full h-[16px] bg-[#ebd7e6] rounded-full"></div>
                {/* Filled Bar */}
                <div 
                  className="absolute top-0 left-0 h-[16px] bg-[#9a2177] rounded-full transition-all duration-500" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="w-[120px] text-sm text-[#475569] font-medium shrink-0">
                {formatValue(val, filterType)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
