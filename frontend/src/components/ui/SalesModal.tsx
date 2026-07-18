import React, { useState, useEffect } from 'react';
import { X, Save, UserCircle, Mail, Phone, Lock, Eye, EyeOff, Map, MapPin, User, Users, Info, Briefcase, CheckCircle2, Trash2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'detail';
  data?: any;
  onSave?: (data: any) => void;
}

export const SalesModal: React.FC<SalesModalProps> = ({ isOpen, onClose, mode, data, onSave }) => {
  const [namaSales, setNamaSales] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [area, setArea] = useState('Bandung');
  const [role, setRole] = useState('Sales');
  const [supervisor, setSupervisor] = useState('Andi');
  const [status, setStatus] = useState('Aktif');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Hide native password reveal button in Edge/IE
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      input[type="password"]::-ms-reveal,
      input[type="password"]::-ms-clear {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'detail' && data) {
        setNamaSales(data.namaSales || '');
        setUsername(data.username || '');
        setEmail(data.email || '');
        setNomorHp(data.nomorHp || '');
        setPassword('**********');
        setAlamat(data.alamat || 'Jl. Jendral Sudirman No. 123');
        setArea(data.area || 'Bandung');
        setRole('Sales');
        setSupervisor(data.supervisor || 'Andi');
        setStatus(data.status || 'Aktif');
      } else {
        setNamaSales('');
        setUsername('');
        setEmail('');
        setNomorHp('');
        setPassword('');
        setAlamat('');
        setArea('Bandung');
        setRole('Sales');
        setSupervisor('Andi');
        setStatus('Aktif');
      }
      setShowPassword(false);
      setShowConfirm(false);
      setShowSuccess(false);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(false);
    }
  }, [isOpen, mode, data]);

  const handleSimpanClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSimpan = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    
    // Simulasikan delay simpan lalu tutup modal
    setTimeout(() => {
      if (onSave) {
        onSave({ namaSales, username, email, nomorHp, password, area, role, supervisor, status });
      }
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    setTimeout(() => {
      setShowDeleteSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-[800px] p-8 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500 border border-red-500 rounded-full p-1 hover:bg-red-50 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Sales' : 'Informasi Sales'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
            {/* Nama Sales */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Nama Sales</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={namaSales}
                  onChange={(e) => setNamaSales(e.target.value)}
                  placeholder="Masukkan nama sales"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <UserCircle size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
              </div>
            </div>

            {/* Nomor HP */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Nomor HP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input 
                  type="text" 
                  value={nomorHp}
                  onChange={(e) => setNomorHp(e.target.value)}
                  placeholder="Masukkan nomor HP"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area}
                onChange={setArea}
                options={['Bandung', 'Jakarta', 'Cirebon', 'Kuningan']}
                icon={<Map size={18} />}
                triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Role</label>
              <CustomSelect 
                value={role}
                onChange={setRole}
                options={['Sales', 'Supervisor', 'Admin']}
                icon={<Briefcase size={18} />}
                triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>

            {/* Supervisor */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor}
                onChange={setSupervisor}
                options={['Andi', 'Hartono', 'Budi']}
                icon={<Users size={18} />}
                triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
              <CustomSelect 
                value={status}
                onChange={setStatus}
                options={['Aktif', 'Tidak Aktif']}
                icon={<Info size={18} />}
                triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>
          </div>

          <div className="flex items-center justify-center pt-2 gap-4">
            {data && (
              <button 
                onClick={handleDeleteClick}
                className="w-[160px] bg-[#ef4444] hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Hapus
              </button>
            )}
            <button 
              onClick={handleSimpanClick}
              className="w-[160px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center">
            <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-gray-600">Data berhasil disimpan.</p>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-8">Apakah Anda ingin menghapus user tersebut?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-medium transition-colors"
              >
                Tidak
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Alert Modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center">
            <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-gray-600">Data berhasil dihapus.</p>
          </div>
        </div>
      )}
    </>
  );
};
