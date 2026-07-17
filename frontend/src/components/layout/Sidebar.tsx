import React from 'react';
import { LayoutDashboard, History, Target, User, Users, UserCheck, ShieldCheck, Menu } from 'lucide-react';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Riwayat Import', icon: History, path: '/import' },
    { name: 'Target Sales', icon: Target, path: '/target-sales' },
    { name: 'Sales', icon: User, path: '/sales' },
    { name: 'Customer', icon: Users, path: '/customer' },
    { name: 'Supervisor', icon: UserCheck, path: '/supervisor' },
    { name: 'Kepala Distributor', icon: ShieldCheck, path: '/distributor' },
  ];

  return (
    <aside className={clsx(
      "bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 transition-all duration-300 z-50",
      isSidebarCollapsed ? "w-20" : "w-[260px]"
    )}>
      <div className={clsx(
        "p-6 flex items-center border-b border-gray-100 h-[88px]",
        isSidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isSidebarCollapsed && (
          <div className="flex items-center">
            <img src="/logo.png" alt="IW Paint Logo" className="h-10 object-contain" />
          </div>
        )}
        
        <button 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                'flex items-center rounded-xl transition-colors font-medium',
                isSidebarCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3.5 text-sm',
                isActive
                  ? 'bg-[#3b0764] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              {!isSidebarCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
