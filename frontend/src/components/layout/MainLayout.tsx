import React from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/useUIStore';
import clsx from 'clsx';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className={clsx(
        "flex-1 p-2 relative transition-all duration-300",
        isSidebarCollapsed ? "ml-20" : "ml-[260px]"
      )}>
        {children}
      </main>
    </div>
  );
};
