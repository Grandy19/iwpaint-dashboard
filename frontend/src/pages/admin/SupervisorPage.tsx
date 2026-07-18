import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Filter, Eye, CheckCircle2, XCircle, Plus, User, UserCircle, Mail, Phone, Lock, EyeOff, Map, Briefcase, Info, Users, Save, MapPin, ChevronDown, Search, Trash2, X } from 'lucide-react';
import clsx from 'clsx';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import { supervisorKpiData, supervisorTableData } from '../../mock/supervisor';

interface SalesOption {
  value: string;
  label: string;
  subLabel?: string;
}

const salesOptions: SalesOption[] = [
  { value: 'fransiskus', label: 'Fransiskus', subLabel: 'Bandung' },
  { value: 'deni', label: 'Deni', subLabel: 'Bandung' },
  { value: 'eko', label: 'Eko', subLabel: 'Jakarta' },
  { value: 'budi', label: 'Budi', subLabel: 'Cirebon' },
  { value: 'siti', label: 'Siti', subLabel: 'Kuningan' },
  { value: 'agus', label: 'Agus', subLabel: 'Jakarta' },
];

export const SupervisorPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [status, setStatus] = useState('Semua Status');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  // Form states
  const [editNamaSupervisor, setEditNamaSupervisor] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNomorHp, setEditNomorHp] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editPassword, setEditPassword] = useState('**********');
  const [editArea, setEditArea] = useState('Bandung');
  const [editRole, setEditRole] = useState('Supervisor');
  const [editSelectedSales, setEditSelectedSales] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState('Aktif');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Sales Sub-Modal State
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [tempSelectedSales, setTempSelectedSales] = useState<string[]>([]);
  const [salesSearchQuery, setSalesSearchQuery] = useState('');

  const handleSimpanClick = () => setShowConfirm(true);
  const handleConfirmSimpan = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };
  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowDeleteSuccess(true);
    setTimeout(() => setShowDeleteSuccess(false), 1500);
  };

  const handleOpenSalesModal = () => {
    setTempSelectedSales(editSelectedSales);
    setSalesSearchQuery('');
    setShowSalesModal(true);
  };
  const handleCloseSalesModal = () => setShowSalesModal(false);
  const handleSaveSalesModal = () => {
    setEditSelectedSales(tempSelectedSales);
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

  const ActionButtons = (
    <div className="flex gap-4">
      <button 
        onClick={() => setIsExportModalOpen(true)}
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => {
          setSelectedSupervisor(null);
          setIsSupervisorModalOpen(true);
        }}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Supervisor
      </button>
    </div>
  );

  const tableColumns = [
    { key: 'namaSupervisor', label: 'Nama Supervisor' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'jumlahSales', label: 'Jumlah Sales' },
    { key: 'status', label: 'Status' },
    { key: 'tanggalBergabung', label: 'Tanggal Bergabung' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSupervisor':
        return <span className="text-gray-700 font-medium">{item.namaSupervisor}</span>;
      case 'status':
        return item.status === 'Aktif' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Aktif
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Tidak Aktif
          </span>
        );
      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedSupervisor(item);
              setIsSupervisorModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const isAllSupervisor = supervisor === 'Semua Supervisor';
  const selectedData = supervisorTableData.find(s => s.namaSupervisor === supervisor) || supervisorTableData[0];

  useEffect(() => {
    if (!isAllSupervisor && selectedData) {
      setEditNamaSupervisor(selectedData.namaSupervisor || '');
      setEditUsername(selectedData.email?.split('@')[0] || '');
      setEditEmail(selectedData.email || '');
      setEditNomorHp(selectedData.nomorHp || '');
      setEditAlamat('Jl. Diponegoro No. 10'); // mock
      setEditPassword('**********');
      setEditArea(selectedData.area || 'Bandung');
      setEditRole('Supervisor');
      setEditSelectedSales([]);
      setEditStatus(selectedData.status || 'Aktif');
      setShowPassword(false);
    }
  }, [selectedData, isAllSupervisor]);

  let salesDisplayText = 'Pilih beberapa...';
  if (editSelectedSales.length === 1) {
    const opt = salesOptions.find(o => o.value === editSelectedSales[0]);
    if (opt) salesDisplayText = opt.label;
  } else if (editSelectedSales.length > 1) {
    salesDisplayText = `${editSelectedSales.length} Terpilih`;
  }

  return (
    <>
      <MainLayout>
        <Topbar 
          title="Supervisor" 
          subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB"
          actionButton={ActionButtons}
        />
        
        <div className="px-8 pb-10">
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
            {supervisorKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <CustomSelect 
                  value={area}
                  onChange={setArea}
                  options={['Semua Area', 'Bandung', 'Jakarta', 'Cirebon', 'Kuningan']}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
                <CustomSelect 
                  value={status}
                  onChange={setStatus}
                  options={['Semua Status', 'Aktif', 'Tidak Aktif']}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
                <CustomSelect 
                  value={supervisor}
                  onChange={setSupervisor}
                  options={['Semua Supervisor', 'Andi', 'Hariono', 'Deni', 'Rahmat', 'Dudu']}
                />
              </div>
              <div className="col-span-1">
                <button className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]">
                  <Filter size={18} />
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          {isAllSupervisor ? (
            <DataTable
              title="Tabel Supervisor"
              columns={tableColumns}
              data={supervisorTableData}
              renderCell={renderCell}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
              <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Supervisor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Nama Supervisor</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input type="text" value={editNamaSupervisor} onChange={(e) => setEditNamaSupervisor(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <UserCircle size={18} />
                    </div>
                    <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Nomor HP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input type="text" value={editNomorHp} onChange={(e) => setEditNomorHp(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input type="text" value={editAlamat} onChange={(e) => setEditAlamat(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input type={showPassword ? "text" : "password"} value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                  <CustomSelect 
                    value={editArea} onChange={setEditArea} options={['Bandung', 'Jakarta', 'Cirebon', 'Kuningan']} 
                    icon={<Map size={18} />} showSearch={false} triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Role</label>
                  <CustomSelect 
                    value={editRole} onChange={setEditRole} options={['Sales', 'Supervisor', 'Admin']} 
                    icon={<Briefcase size={18} />} showSearch={false} triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
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
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
                  <CustomSelect 
                    value={editStatus} onChange={setEditStatus} options={['Aktif', 'Tidak Aktif']} 
                    icon={<Info size={18} />} showSearch={false} triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-center pt-2 gap-4">
                <button onClick={handleDeleteClick} className="w-[160px] bg-[#ef4444] hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={18} />
                  Hapus
                </button>
                <button onClick={handleSimpanClick} className="w-[160px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  <Save size={18} />
                  Simpan
                </button>
              </div>
            </div>
          )}

        </div>
      </MainLayout>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Supervisor.xlsx" 
      />
      
      <SupervisorModal 
        isOpen={isSupervisorModalOpen}
        onClose={() => setIsSupervisorModalOpen(false)}
        data={selectedSupervisor}
      />

      {/* Sub-Modal Pemilihan Sales */}
      {showSalesModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]" onClick={handleCloseSalesModal}>
          <div className="bg-white rounded-2xl w-[450px] shadow-2xl relative flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Pilih Sales</h3>
              <button onClick={handleCloseSalesModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
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
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30 rounded-b-2xl">
              <button onClick={handleCloseSalesModal} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Batal
              </button>
              <button onClick={handleSaveSalesModal} className="bg-[#52b788] hover:bg-[#40916c] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                <Save size={16} />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-8">Apakah Anda ingin menyimpan data tersebut?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors">
                Tidak
              </button>
              <button onClick={handleConfirmSimpan} className="w-[120px] bg-[#52b788] hover:bg-[#40916c] text-white py-2.5 rounded-xl font-medium transition-colors">
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
              <button onClick={() => setShowDeleteConfirm(false)} className="w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-medium transition-colors">
                Tidak
              </button>
              <button onClick={handleConfirmDelete} className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors">
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
