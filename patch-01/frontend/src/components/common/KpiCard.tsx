import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  percentageLabel?: string;
  progress?: number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  iconColor = 'text-[#10b981]',
  iconBg = 'bg-[#dcfce7]',
  percentageLabel,
  progress
}) => {
  return (
    <div className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1">
      {/* Decorative subtle glow based on iconBg */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${iconBg} opacity-30 blur-3xl group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`}></div>
      
      <div className="relative flex justify-between items-start mb-5">
        <span className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">{title}</span>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} ${iconColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm border border-white/50`}>
          <Icon size={24} strokeWidth={1.75} />
        </div>
      </div>
      
      <div className="relative flex flex-col mb-2">
        <div className={`flex items-baseline gap-3 ${progress !== undefined ? 'mb-4' : ''}`}>
          <h2 className="text-[28px] font-semibold text-slate-800 tracking-tight">{value}</h2>
          {percentageLabel && (
            <span className={`text-xs font-bold ${iconColor} ${iconBg} px-2.5 py-1 rounded-full flex items-center shadow-sm`}>
              {percentageLabel}
            </span>
          )}
        </div>
        {progress !== undefined && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="relative mt-auto pt-2 border-t border-slate-50">
        <span className="text-[13px] text-slate-400 font-medium leading-relaxed">{description}</span>
      </div>
    </div>
  );
};
