import React, { useState, useEffect } from 'react';
import { X, User, UserCircle, Mail, Phone, Lock, Eye, EyeOff, Map, Briefcase, Info, Users, Save, CheckCircle2, MapPin, ChevronDown, Search, Trash2, Target } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { DataTable } from '../common/DataTable';
import { mockSupervisorSalesData } from '../../mock/distributorSupervisor';
import clsx from 'clsx';

interface SupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  onSave?: (data: any) => void;
  mode?: 'edit' | 'detail' | 'view_only';
}

interface SalesOption {
  value: string;
  label: string;
  subLabel?: string;
}

// Mock data for sales options
const salesOptions: SalesOption[] = [
  { value: 'fransiskus', label: 'Fransiskus', subLabel: 'Bandung' },
  { value: 'deni', label: 'Deni', subLabel: 'Bandung' },
  { value: 'eko', label: 'Eko', subLabel: 'Jakarta' },
  { value: 'budi', label: 'Budi', subLabel: 'Cirebon' },
  { value: 'siti', label: 'Siti', subLabel: 'Kuningan' },
  { value: 'agus', label: 'Agus', subLabel: 'Jakarta' },
];

export const SupervisorModal: React.FC<SupervisorModalProps> = ({ isOpen, onClose, data, onSave, mode = 'edit' }) => {
  // Kiri
  const [namaSupervisor, setNamaSupervisor] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [area, setArea] = useState('Bandung');
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  // Kanan
  const [username, setUsername] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Supervisor');
  const [status, setStatus] = useState('Aktif');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Sales Sub-Modal State
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showViewSalesModal, setShowViewSalesModal] = useState(false);
  const [tempSelectedSales, setTempSelectedSales] = useState<string[]>([]);
  const [salesSearchQuery, setSalesSearchQuery] = useState('');

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
      if (data) {
        setNamaSupervisor(data.namaSupervisor || '');
        setEmail(data.email || '');
        setAlamat(data.alamat || '');
        setArea(data.area || 'Bandung');
        setSelectedSales(data.selectedSales || []);

        setUsername(data.username || `${data.namaSupervisor || 'User'}SPV01`.replace(/\s/g, ''));
        setNomorHp(data.nomorHp || '');
        setPassword(data.password || '**********');
        setRole(data.role || 'Supervisor');
        setStatus(data.status || 'Aktif');
      } else {
        setNamaSupervisor('');
        setEmail('');
        setAlamat('');
        setArea('Bandung');
        setSelectedSales([]);

        setUsername('');
        setNomorHp('');
        setPassword('');
        setRole('Supervisor');
        setStatus('Aktif');
      }
      setShowPassword(false);
      setShowConfirm(false);
      setShowSuccess(false);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(false);
      setShowSalesModal(false);
      setShowViewSalesModal(false);
    }
  }, [isOpen, data]);

  const handleSimpanClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSimpan = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    
    // Simulasikan delay simpan lalu tutup modal
    setTimeout(() => {
      if (onSave) {
        onSave({ namaSupervisor, email, alamat, area, selectedSales, username, nomorHp, password, role, status });
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

  // Logika Sub-Modal Sales
  const handleOpenSalesModal = () => {
    setTempSelectedSales(selectedSales);
    setSalesSearchQuery('');
    setShowSalesModal(true);
  };

  const handleCloseSalesModal = () => {
    setShowSalesModal(false);
  };

  const handleSaveSalesModal = () => {
    setSelectedSales(tempSelectedSales);
    setShowSalesModal(false);
  };

  const toggleSalesSelection = (value: string) => {
    if (tempSelectedSales.includes(value)) {
      setTempSelectedSales(tempSelectedSales.filter(v => v !== value));
    } else {
      setTempSelectedSales([...tempSelectedSales, value]);
    }
  };

  const filteredSalesOptions = salesOptions.filter(opt => 
    opt.label.toLowerCase().includes(salesSearchQuery.toLowerCase()) || 
    (opt.subLabel && opt.subLabel.toLowerCase().includes(salesSearchQuery.toLowerCase()))
  );

  const salesTableColumns = [
    { key: 'namaSales', label: 'Nama Sales' },
    { key: 'area', label: 'Area' },
    { key: 'customer', label: 'Customer' },
    { key: 'target', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
  ];

  const renderSalesTableCell = (item: any, columnKey: string) => {
    return item[columnKey];
  };

  if (!isOpen) return null;

  // Render teks untuk field Sales
  let salesDisplayText = 'Pilih beberapa...';
  if (selectedSales.length === 1) {
    const opt = salesOptions.find(o => o.value === selectedSales[0]);
    if (opt) salesDisplayText = opt.label;
  } else if (selectedSales.length > 1) {
    salesDisplayText = `${selectedSales.length} Terpilih`;
  }

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
            <h3 className="text-gray-600 text-[18px] font-medium">
              {data ? 'Informasi Supervisor' : 'Tambah Supervisor'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
            
            {/* ================= KOLOM KIRI ================= */}

            {/* Nama Supervisor */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Nama Supervisor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={namaSupervisor}
                  onChange={(e) => setNamaSupervisor(e.target.value)}
                  placeholder="Masukkan nama"
                  readOnly={mode === 'view_only'}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors ${mode !== 'view_only' ? 'focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764]' : ''}`}
                />
              </div>
            </div>

            {/* Username (Kolom Kanan) */}
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
                  readOnly={mode === 'view_only'}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors ${mode !== 'view_only' ? 'focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764]' : ''}`}
                />
              </div>
            </div>

            {/* Email (Kolom Kiri) */}
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
                  readOnly={mode === 'view_only'}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors ${mode !== 'view_only' ? 'focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764]' : ''}`}
                />
              </div>
            </div>

            {/* Nomor HP (Kolom Kanan) */}
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
                  readOnly={mode === 'view_only'}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors ${mode !== 'view_only' ? 'focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764]' : ''}`}
                />
              </div>
            </div>

            {/* Alamat (Kolom Kiri) */}
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
                  placeholder="Masukkan alamat"
                  readOnly={mode === 'view_only'}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors ${mode !== 'view_only' ? 'focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764]' : ''}`}
                />
              </div>
            </div>

            {/* Area (Kolom Kanan if Password is hidden) */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              {mode === 'view_only' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Map size={18} />
                  </div>
                  <input type="text" value={area} readOnly className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              ) : (
                <CustomSelect 
                  value={area}
                  onChange={setArea}
                  options={['Bandung', 'Jakarta', 'Cirebon', 'Kuningan']}
                  icon={<Map size={18} />}
                  triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                  showSearch={false}
                />
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Role</label>
              {mode === 'view_only' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Briefcase size={18} />
                  </div>
                  <input type="text" value={role} readOnly className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              ) : (
                <CustomSelect 
                  value={role}
                  onChange={setRole}
                  options={['Sales', 'Supervisor', 'Admin']}
                  icon={<Briefcase size={18} />}
                  triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                  showSearch={false}
                />
              )}
            </div>

            {/* Sales (or Jumlah Sales in view_only) */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">{mode === 'view_only' ? 'Jumlah Sales' : 'Sales'}</label>
              {mode === 'view_only' ? (
                <div 
                  onClick={() => setShowViewSalesModal(true)}
                  className="relative flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer hover:border-[#3b0764] hover:ring-1 hover:ring-[#3b0764] transition-colors"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                  <span className="truncate">{data?.jumlahSales || '12 Sales'}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              ) : (
                <div 
                  onClick={handleOpenSalesModal}
                  className="relative flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer hover:border-[#3b0764] hover:ring-1 hover:ring-[#3b0764] transition-colors"
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                  <span className="truncate">{salesDisplayText}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              )}
            </div>

            {/* Conditional Fields for view_only: Target and Realisasi */}
            {mode === 'view_only' ? (
              <>
                {/* Target */}
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Target</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Target size={18} />
                    </div>
                    <input type="text" value={data?.target || 'Rp 0'} readOnly className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>

                {/* Realisasi */}
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Realisasi</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <input type="text" value={data?.realisasi || 'Rp 0'} readOnly className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

          </div>

          {mode !== 'view_only' && (
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
          )}

          {mode === 'view_only' && (
            <div className="mt-8 pt-4">
              {/* Optional: Tambahan informasi lain yang read-only jika perlu */}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Sub-Modal View Sales (Read-Only) */}
      {/* ============================================================ */}
      {showViewSalesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]" onClick={() => setShowViewSalesModal(false)}>
          <div className="bg-white rounded-2xl w-[800px] shadow-2xl relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h3 className="text-gray-600 text-[18px] font-medium">Daftar Sales Bawahan</h3>
              <button 
                onClick={() => setShowViewSalesModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <DataTable 
                title=""
                columns={salesTableColumns}
                data={mockSupervisorSalesData}
                renderCell={renderSalesTableCell}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Sub-Modal Pemilihan Sales */}
      {/* ============================================================ */}
      {showSalesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]" onClick={handleCloseSalesModal}>
          <div className="bg-white rounded-2xl w-[450px] shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Pilih Sales</h3>
              <button 
                onClick={handleCloseSalesModal}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#3b0764] focus:border-[#3b0764]"
                  placeholder="Cari nama atau area sales..."
                  value={salesSearchQuery}
                  onChange={(e) => setSalesSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* List Option */}
            <div className="overflow-y-auto max-h-[300px] p-2">
              {filteredSalesOptions.length > 0 ? (
                filteredSalesOptions.map((option, index) => {
                  const isSelected = tempSelectedSales.includes(option.value);
                  return (
                    <div
                      key={index}
                      className="flex items-center px-4 py-3 mx-2 my-1 rounded-lg hover:bg-[#fcf8ff] cursor-pointer transition-colors"
                      onClick={() => toggleSalesSelection(option.value)}
                    >
                      {/* Checkbox styling */}
                      <div className="flex-shrink-0 mr-4">
                        <div className={clsx(
                          "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors",
                          isSelected ? "bg-[#3b0764] border-[#3b0764]" : "border-gray-300 bg-white"
                        )}>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      {/* Label Content */}
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className={clsx("text-sm truncate", isSelected ? "text-[#3b0764] font-medium" : "text-gray-800 font-medium")}>
                          {option.label}
                        </span>
                        {option.subLabel && (
                          <div className="flex items-center pl-4 ml-auto">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {option.subLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-sm text-gray-500 text-center">
                  Tidak ada sales ditemukan
                </div>
              )}
            </div>

            {/* Footer / Action */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30 rounded-b-2xl">
              <button 
                onClick={handleCloseSalesModal}
                className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveSalesModal}
                className="bg-[#52b788] hover:bg-[#40916c] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save size={16} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal (Main Save) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowDeleteConfirm(false)}>
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
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
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
