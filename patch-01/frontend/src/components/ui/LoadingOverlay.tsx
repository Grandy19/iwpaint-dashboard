import React from 'react';
import { DotsRing } from '../common/PageTransitionLoader';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Memuat data...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-[2px] animate-fadeIn transition-all">
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-gray-100 min-w-[180px]">
        <DotsRing size={48} count={10} color="#3b0764" />
        <p className="mt-3 text-gray-700 font-medium text-sm">{message}</p>
      </div>
    </div>
  );
};
