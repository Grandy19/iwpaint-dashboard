import React from 'react';
import { ArrowDown } from 'lucide-react';

interface RingkasanTargetCardProps {
  percentage: number;
  targetGlobal: string;
  realisasi: string;
  selisih: string;
  title?: string;
}

export const RingkasanTargetCard: React.FC<RingkasanTargetCardProps> = ({
  percentage,
  targetGlobal,
  realisasi,
  selisih,
  title = "Ringkasan Keseluruhan Target"
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-gray-600 text-[18px] font-medium mb-6">{title}</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e0f2fe" strokeWidth="12" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="12" strokeDasharray={`${percentage * 2.51} 251`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[24px] font-bold text-[#0ea5e9]">{percentage}%</span>
            <span className="text-xs text-gray-500 font-medium mt-1">Tercapai</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#e0f2fe]"></div>
              <span className="text-gray-500">Target Global</span>
            </div>
            <span className="font-semibold text-gray-800">{targetGlobal}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
              <span className="text-gray-500">Realisasi</span>
            </div>
            <span className="font-semibold text-gray-800">{realisasi}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm bg-[#fee2e2] px-3 py-2 rounded-lg mt-1">
            <div className="flex items-center gap-2 text-[#ef4444]">
              <ArrowDown size={14} />
              <span className="font-medium">Selisih</span>
            </div>
            <span className="font-bold text-[#ef4444]">{selisih}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
