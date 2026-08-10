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
  const displayPercentage = Math.min(Math.max(percentage || 0, 0), 100);

  return (
    <div className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1">
      {/* Decorative glow */}
      <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full bg-blue-100 opacity-30 blur-3xl group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"></div>
      
      <h3 className="relative text-slate-500 text-[13px] font-bold tracking-wider uppercase mb-8">{title}</h3>
      
      <div className="relative flex-1 flex flex-col justify-center">
        <div className="relative w-44 h-44 mx-auto mb-10 group-hover:scale-105 transition-transform duration-500">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#2D9CDB" strokeWidth="10" strokeDasharray={`${displayPercentage * 2.51} 251`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
            <span className="text-3xl font-bold text-[#2D9CDB] tracking-tight">{displayPercentage}%</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Tercapai</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-center text-sm px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              <span className="text-slate-500 font-medium">Target Global</span>
            </div>
            <span className="font-bold text-slate-700">{targetGlobal}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D9CDB] shadow-[0_0_8px_rgba(45,156,219,0.4)]"></div>
              <span className="text-slate-500 font-medium">Realisasi</span>
            </div>
            <span className="font-bold text-slate-800">{realisasi}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm bg-red-50/80 border border-red-100 px-4 py-2.5 rounded-xl mt-2 transition-colors group-hover:bg-red-50">
            <div className="flex items-center gap-2 text-red-500">
              <ArrowDown size={16} strokeWidth={2.5} />
              <span className="font-bold tracking-wide">Selisih</span>
            </div>
            <span className="font-bold text-red-600">{selisih}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
