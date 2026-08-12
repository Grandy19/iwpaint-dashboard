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
  onEdit?: () => void;
  title?: string;
}

export const TargetRealisasiCard: React.FC<TargetRealisasiCardProps> = ({ data, onEdit, title = "Target vs Realisasi Bulan Ini" }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40">
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">{title}</h3>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 p-2 rounded-xl transition-colors"
          >
            <Edit3 size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {data.map((item) => {
          const Icon = item.icon;
          const pct = Math.min(Math.max(item.percentage || 0, 0), 100);
          return (
            <div key={item.id} className="group border border-slate-100 rounded-2xl p-5 hover:border-blue-100 hover:bg-blue-50/30 transition-colors duration-300">
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <span className="font-bold text-slate-700 text-[15px]">{item.title}</span>
                </div>
                <span className="font-bold text-[#2D9CDB] text-lg tracking-tight">
                  {pct}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-[#2D9CDB] rounded-full relative transition-all duration-1000 ease-out" 
                  style={{ width: `${pct}%` }}
                ></div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500 bg-white/50 rounded-xl p-3 border border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span className="font-medium text-slate-400">Realisasi:</span> 
                  <span className="font-bold text-slate-700">{item.realisasi}</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <span className="font-medium text-slate-400">Target:</span> 
                  <span className="font-bold text-slate-700">{item.target}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
