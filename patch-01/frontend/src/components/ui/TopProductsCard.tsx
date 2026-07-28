import React from 'react';

interface ProductItem {
  id: number;
  name: string;
  value: number;
  max: number;
  label: string;
}

interface TopProductsCardProps {
  data: ProductItem[];
  title?: string;
}

export const TopProductsCard: React.FC<TopProductsCardProps> = ({ data, title = "Top 10 Produk Terlaris Penjualan Customer" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-8">
        <h3 className="text-gray-600 text-[18px] font-medium">{title}</h3>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1 font-medium">Total:</div>
          <div className="font-bold text-[#1e293b] text-[20px]">Rp 450 Jt</div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex flex-col gap-8 max-h-[340px] overflow-y-auto custom-scroll pr-4">
        {data.map((item) => {
          const percentage = (item.value / item.max) * 100;
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
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
