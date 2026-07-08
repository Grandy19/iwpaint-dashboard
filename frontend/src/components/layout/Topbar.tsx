import React from 'react';
import { Settings, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  actionButton?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, actionButton }) => {
  return (
    <header className="flex justify-between items-center py-6 px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Terakhir Diperbarui: Hari Ini, 10.45 WIB</p>
      </div>
      <div className="flex items-center gap-4">
        {actionButton}
        <button className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
          <Settings size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
          <User size={24} />
        </div>
      </div>
    </header>
  );
};
