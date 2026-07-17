import React from 'react';
import { Edit3 } from 'lucide-react';

interface TargetItem {
  id: string;
  title: string;
  icon: React.ElementType;
  percentage: number;
  realisasi: string;
  target: string;
}

interface TargetRealisasiCardProps {
  data: TargetItem[];
  onEdit: () => void;
}

export const TargetRealisasiCard: React.FC<TargetRealisasiCardProps> = ({ data, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-[18px]">Target vs Realisasi</h3>
        <button 
          onClick={onEdit}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Edit3 size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {data.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="border border-gray-100 rounded-xl p-5">
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] flex items-center justify-center text-[#0ea5e9]">
                    <Icon size={20} />
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                </div>
                <span className="font-bold text-gray-800">{item.percentage}%</span>
              </div>

              <div className="w-full h-2.5 bg-[#e0f2fe] rounded-full mb-4">
                <div 
                  className="h-2.5 bg-[#0ea5e9] rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Realisasi :</span> {item.realisasi}
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div>
                  <span className="font-medium">Target :</span> {item.target}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
