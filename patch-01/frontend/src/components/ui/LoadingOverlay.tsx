import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message = 'Memuat data...' }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#3b0764] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};
