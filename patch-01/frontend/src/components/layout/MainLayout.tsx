import React from 'react';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/useUIStore';
import clsx from 'clsx';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebarItems?: { name: string; icon: React.ElementType; path: string }[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, sidebarItems }) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar items={sidebarItems} />
      <main id="export-content" className={clsx(
        "flex-1 p-2 relative transition-all duration-300",
        isSidebarCollapsed ? "ml-20" : "ml-[260px]"
      )}>
        {children}
      </main>
    </div>
  );
};
