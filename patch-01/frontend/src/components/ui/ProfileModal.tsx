import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Shield, Bell, Save, AlertCircle, Eye, EyeOff, MapPin, Mail, Phone, Edit3, Lock, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'security';
  user: any; // We receive user to get the role, but data will be dummy
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, defaultTab = 'profile', user }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>(defaultTab);

  // Sync activeTab if defaultTab changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, defaultTab]);

  // DUMMY DATA FOR FRONTEND PURPOSES
  const dummyUser = {
    name: 'Budi Santoso',
    email: 'budi.santoso@iwpaint.com',
    phone: '0812-3456-7890',
    area: 'Jakarta Raya',
    role: user?.role || 'admin',
    roleDisplay: user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'distributor' ? 'Kepala Distributor' : 
                 user?.role === 'supervisor' ? 'Supervisor' : 'Sales'
  };

  // State for forms
  const [name, setName] = useState(dummyUser.name);
  const [email, setEmail] = useState(dummyUser.email);
  const [phone, setPhone] = useState(dummyUser.phone);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingAction, setPendingAction] = useState<'profile' | 'security' | null>(null);

  // Form Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction('profile');
    setShowConfirm(true);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi password baru tidak cocok!');
      return;
    }
    setPendingAction('security');
    setShowConfirm(true);
  };

  const handleConfirmSimpan = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(false);
      setPendingAction(null);
      if (pendingAction === 'security') {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    }, 1500);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 sm:p-6 md:p-8"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-[800px] h-[600px] shadow-xl relative flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Sidebar (Tabs) */}
        <div className="w-full md:w-[220px] bg-slate-50 border-r border-slate-100 flex flex-col flex-shrink-0 p-6 overflow-y-auto">
          <div className="mb-8 border-b border-slate-100 pb-4 flex items-center justify-between md:block">
            <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">
              Pengaturan
            </h3>
            {/* Mobile close button */}
            <button onClick={onClose} className="md:hidden text-red-500 border border-red-500 rounded-full p-1 hover:bg-red-50 transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#3b0764] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <User size={16} /> Profil Pengguna
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-colors ${activeTab === 'security' ? 'bg-[#3b0764] text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Shield size={18} /> Keamanan Akun
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 relative flex flex-col h-full overflow-hidden">
          
          {/* Header Action (Close) */}
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onClose}
              className="text-red-500 border border-red-500 rounded-full p-1 hover:bg-red-50 transition-colors hidden md:block bg-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-8 mt-2 flex-1 overflow-y-auto hide-scrollbar">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8 border-b border-slate-100 pb-4">
                  <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">
                    Profil Pengguna
                  </h3>
                </div>
                
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Area */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-50 overflow-hidden shadow-md bg-gray-100">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dummyUser.name)}&background=10b981&color=fff&size=80`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">{dummyUser.name}</h4>
                      <p className="text-[#10b981] font-medium text-sm">{dummyUser.roleDisplay}</p>
                      <button type="button" className="mt-3 px-4 py-1.5 bg-white border border-gray-200 text-gray-800 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Edit3 size={14} /> Ubah Foto
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Nama Lengkap</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <User size={16} />
                        </div>
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Nomor Handphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <Phone size={16} />
                        </div>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Alamat Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <Mail size={16} />
                        </div>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Area Tugas</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <MapPin size={16} />
                        </div>
                        <input 
                          type="text" 
                          value={dummyUser.area}
                          readOnly
                          className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-slate-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-center">
                    <button type="submit" className="w-[160px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <Save size={16} /> Simpan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8 border-b border-slate-100 pb-4">
                  <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">
                    Keamanan Akun
                  </h3>
                </div>
                
                <form onSubmit={handleSaveSecurity} className="space-y-6">
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Kata Sandi Saat Ini</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                          <Lock size={16} />
                        </div>
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Kata Sandi Baru</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Lock size={16} />
                          </div>
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Konfirmasi Kata Sandi</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Lock size={16} />
                          </div>
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 pb-4 flex justify-center">
                    <button type="submit" className="w-[160px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                      <Save size={16} /> Perbarui
                    </button>
                  </div>
                </form>

                <div className="border-t border-slate-100 pt-8 mt-4">
                  <h3 className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-4">Riwayat Login (Mock)</h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/60 pb-3">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">Windows 11 • Chrome</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={10}/> Jakarta, Indonesia • IP: 192.168.1.1</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#10b981] bg-[#dcfce7] px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">Saat Ini</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">MacOs • Safari</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><MapPin size={10}/> Bandung, Indonesia • IP: 103.111.0.42</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-md uppercase tracking-wider">Kemarin</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-8">Apakah Anda ingin menyimpan data tersebut?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Tidak
              </button>
              <button 
                onClick={handleConfirmSimpan}
                className="w-[120px] bg-[#52b788] hover:bg-[#40916c] text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center">
            <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-gray-600">Data berhasil disimpan.</p>
          </div>
        </div>
      )}
    </div>
  );

  // Render modal outside of Topbar's backdrop-filter using a React Portal
  return createPortal(modalContent, document.body);
};
