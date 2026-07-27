import React from 'react';
import { X, Target, Banknote, TrendingUp, PaintRoller, Wrench, Factory } from 'lucide-react';

interface AreaTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const AreaTargetModal: React.FC<AreaTargetModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const categoryIcons: Record<string, any> = {
    'Decorative': PaintRoller,
    'Automotive': Wrench,
    'Industri': Factory
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#1e293b]">Detail Performa Area</h2>
            <p className="text-sm text-gray-500 mt-1">Area: <span className="font-semibold text-gray-700">{data.area}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Target size={16} className="text-[#10b981]" />
                <span className="text-sm font-medium">Total Target</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{data.target}</p>
            </div>
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Banknote size={16} className="text-[#10b981]" />
                <span className="text-sm font-medium">Total Realisasi</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{data.realisasi}</p>
            </div>
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <TrendingUp size={16} className="text-[#10b981]" />
                <span className="text-sm font-medium">Pencapaian</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{data.pencapaian}</p>
            </div>
          </div>

          <h3 className="text-[15px] font-bold text-gray-800 mb-4 flex items-center gap-2">
            Target vs Realisasi Kategori
          </h3>
          
          <div className="space-y-4">
            {data.categories?.map((cat: any, idx: number) => {
              const Icon = categoryIcons[cat.name] || PaintRoller;
              return (
                <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-gray-600">
                        <Icon size={16} />
                      </div>
                      <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Target</span>
                      <span className="font-semibold text-gray-800">{cat.target}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs mb-1">Realisasi</span>
                      <span className="font-semibold text-[#10b981]">{cat.realisasi}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
