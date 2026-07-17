import type { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  percentageLabel?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  iconColor = 'text-[#10b981]',
  iconBg = 'bg-[#dcfce7]',
  percentageLabel
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-600 text-[18px] font-medium">{title}</span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[28px] font-medium text-gray-800">{value}</h2>
        {percentageLabel && (
          <span className="text-sm font-semibold text-[#10b981] bg-[#dcfce7] px-2 py-0.5 rounded-full flex items-center">
            {percentageLabel}
          </span>
        )}
      </div>
      <span className="text-xs text-gray-400">{description}</span>
    </div>
  );
};
