import React from 'react';
import { Target, Plus } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  completedLabel: string;
  pendingLabel: string;
  unit: string;
  onAction?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  completedLabel,
  pendingLabel,
  unit,
  onAction
}) => {
  const percentage = total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
            <Target size={20} />
          </div>
          <span className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">{title}</span>
        </div>
        <div className="font-bold text-gray-800 text-[18px]">
          {current}/{total}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-3 bg-[#52b788] rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-6">
          <div className="text-[13px] text-slate-400 font-medium leading-relaxed">
            <span className="mr-1">{completedLabel}</span>
            <span className="font-bold text-[#10b981]">{current}</span>
            <span className="ml-1">{unit}</span>
          </div>
          <div className="w-px h-4 bg-gray-200"></div>
          <div className="text-[13px] text-slate-400 font-medium leading-relaxed">
            <span className="mr-1">{pendingLabel}</span>
            <span className="font-bold text-[#ef4444]">{total - current}</span>
            <span className="ml-1">{unit}</span>
          </div>
        </div>
        {onAction && (
          <button 
            onClick={onAction}
            className="bg-[#52b788] hover:bg-[#40916c] text-white px-6 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Target
          </button>
        )}
      </div>
    </div>
  );
};
