import React, { useState } from 'react';
import { Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ProfileModal } from '../ui/ProfileModal';
import { ViewProfileModal } from '../ui/ViewProfileModal';

interface TopbarProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ 
  title, 
  subtitle = "Terakhir Diperbarui: Hari Ini, 10.45 WIB", 
  actionButton 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState<'profile' | 'security'>('security');

  const openSettings = (tab: 'profile' | 'security') => {
    setModalDefaultTab(tab);
    setIsSettingsModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center py-6 px-8 h-[88px] backdrop-blur-md bg-[#f8fafc]/80 border-b border-transparent transition-all">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        {actionButton}
        <div className="flex items-center gap-[40px] relative">
          <button 
            onClick={() => openSettings('profile')}
            className="w-10 h-10 rounded-xl bg-[#e2e8f0] hover:bg-gray-300 text-gray-600 transition-colors flex items-center justify-center z-10"
          >
            <Settings size={20} />
          </button>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-px bg-gray-300"></div>
          <button 
            onClick={() => setIsViewProfileOpen(true)}
            className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white overflow-hidden z-10 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-gray-800 transition-all"
          >
            {user ? (
               <img 
                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&size=40`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
               />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>

      <ProfileModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        defaultTab={modalDefaultTab}
        user={user}
      />

      <ViewProfileModal 
        isOpen={isViewProfileOpen}
        onClose={() => setIsViewProfileOpen(false)}
        user={user}
      />
    </header>
  );
};
