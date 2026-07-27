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
import api from '../../utils/api';

interface SalesOption {
  value: string;
  label: string;
  subLabel?: string;
}

export const SupervisorPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [status, setStatus] = useState('Semua Status');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  // Dynamic lists
  const [supervisorsData, setSupervisorsData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<SalesOption[]>([]);
  const [areaOptions, setAreaOptions] = useState<string[]>(['Semua Area']);
  const [supervisorOptions, setSupervisorOptions] = useState<string[]>(['Semua Supervisor']);

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

  const loadData = async () => {
    try {
      // Fetch supervisors
      const supervisorRes = await api.get('/users?role=supervisor');
      const allSupervisors = supervisorRes.data.data;
      setSupervisorsData(allSupervisors);

      // Fetch all sales for assignment options
      const salesRes = await api.get('/users?role=sales');
      const allSales = salesRes.data.data;
      setSalesOptions(allSales.map((s: any) => ({
        value: s.namaSales,
        label: s.namaSales,
        subLabel: s.area
      })));

      // Populate filters
      const uniqueAreas = Array.from(new Set(allSupervisors.map((s: any) => s.area).filter(Boolean))) as string[];
      setAreaOptions(['Semua Area', ...uniqueAreas]);
      setSupervisorOptions(['Semua Supervisor', ...allSupervisors.map((s: any) => s.namaSupervisor)]);

      // Calculate KPIs
      const totalCount = allSupervisors.length;
      const activeCount = allSupervisors.filter((s: any) => s.status === 'Aktif').length;
      const inactiveCount = totalCount - activeCount;

      setKpis([
        {
          id: 1,
          title: 'Total Supervisor',
          value: `${totalCount} Supervisor`,
          description: 'Total supervisor yang terdaftar pada sistem',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Supervisor Aktif',
          value: `${activeCount} Supervisor`,
          description: 'Supervisor dengan status aktif',
          icon: CheckCircle2,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Supervisor Tidak Aktif',
          value: `${inactiveCount} Supervisor`,
          description: 'Supervisor dengan status tidak aktif',
          icon: XCircle,
          iconColor: 'text-[#ef4444]',
          iconBg: 'bg-[#fee2e2]',
        }
      ]);

    } catch (err) {
      console.error('Failed to load supervisor data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimpanClick = () => setShowConfirm(true);

  const handleConfirmSimpan = async () => {
    setShowConfirm(false);
    try {
      if (selectedSupervisorData) {
        await api.put(`/users/${selectedSupervisorData.id}`, {
          name: editNamaSupervisor,
          username: editUsername,
          email: editEmail,
          nomorHp: editNomorHp,
          alamat: editAlamat,
          password: editPassword,
          area: editArea,
          status: editStatus,
          salesList: editSelectedSales
        });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          loadData();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to update supervisor:', err);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      if (selectedSupervisorData) {
        await api.delete(`/users/${selectedSupervisorData.id}`);
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
          setSupervisor('Semua Supervisor');
          loadData();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to delete supervisor:', err);
    }
  };

  const handleCreateOrUpdateModal = async (formData: any) => {
    try {
      if (selectedSupervisor) {
        await api.put(`/users/${selectedSupervisor.id}`, formData);
      } else {
        await api.post('/users', { ...formData, role: 'supervisor' });
      }
      setIsSupervisorModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save supervisor via modal:', err);
    }
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
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
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
    { key: 'action', label: 'Detail' },
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
      case 'action':
        return (
          <button 
            onClick={() => {
              setSelectedSupervisor(item);
              setIsSupervisorModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const isAllSupervisors = supervisor === 'Semua Supervisor';
  const filteredSupervisorData = supervisorsData.filter((s: any) => {
    if (area !== 'Semua Area' && s.area !== area) return false;
    if (status !== 'Semua Status' && s.status !== status) return false;
    return true;
  });

  const selectedSupervisorData = (!isAllSupervisors ? supervisorsData.find(s => s.namaSupervisor === supervisor) : null) as any;

  useEffect(() => {
    if (!isAllSupervisors && selectedSupervisorData) {
      setEditNamaSupervisor(selectedSupervisorData.namaSupervisor || '');
      setEditUsername(selectedSupervisorData.username || '');
      setEditEmail(selectedSupervisorData.email || '');
      setEditNomorHp(selectedSupervisorData.nomorHp || '');
      setEditAlamat(selectedSupervisorData.alamat || 'Jl. Moh Toha No. 12 Bandung');
      setEditArea(selectedSupervisorData.area || 'Bandung');
      setEditRole('Supervisor');
      setEditSelectedSales(selectedSupervisorData.salesList || []);
      setEditStatus(selectedSupervisorData.status || 'Aktif');
      setEditPassword('**********');
      setShowPassword(false);
    }
  }, [selectedSupervisorData, isAllSupervisors]);

  return (
    <>
      <MainLayout>
        <Topbar title="Supervisor" subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB" actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
            {kpis.map((kpi) => (
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
                  options={areaOptions} 
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
                  options={supervisorOptions} 
                />
              </div>
              <div className="col-span-1">
                <button 
                  onClick={loadData}
                  className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px] cursor-pointer"
                >
                  <Filter size={18} />
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          {isAllSupervisors ? (
            <DataTable
              title="Tabel Supervisor"
              columns={tableColumns}
              data={filteredSupervisorData}
              renderCell={renderCell}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
              <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Supervisor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
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
                
                <div className="col-span-2">
                  <label className="block text-sm text-[#475569] font-medium mb-2">Sales Terpilih</label>
                  <div 
                    onClick={handleOpenSalesModal}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-gray-800 cursor-pointer hover:border-gray-300 transition-colors bg-white select-none"
                  >
                    <div className="flex flex-wrap gap-1.5 max-w-[90%]">
                      {editSelectedSales.length === 0 ? (
                        <span className="text-gray-400 text-[14px]">Pilih Sales...</span>
                      ) : (
                        editSelectedSales.map(item => (
                          <span key={item} className="bg-purple-50 text-[#3b0764] border border-purple-200 px-2 py-0.5 rounded-md text-[13px] font-medium flex items-center gap-1">
                            {item}
                            <X size={12} className="hover:text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditSelectedSales(editSelectedSales.filter(v => v !== item)); }} />
                          </span>
                        ))
                      )}
                    </div>
                    <ChevronDown size={18} className="text-gray-400" />
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
              
              <div className="flex items-center justify-center pt-8 gap-4">
                <button onClick={handleDeleteClick} className="w-[160px] bg-[#ef4444] hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Trash2 size={18} />
                  Hapus
                </button>
                <button onClick={handleSimpanClick} className="w-[160px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Save size={18} />
                  Simpan
                </button>
              </div>
            </div>
          )}

        </div>
      </MainLayout>

      {/* Sales Sub-selection Modal */}
      {showSalesModal && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl w-[450px] p-6 shadow-xl relative border border-gray-100 flex flex-col max-h-[85vh]">
            <button onClick={handleCloseSalesModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="font-bold text-gray-900 text-[18px] mb-4">Pilih Sales</h3>
            
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={salesSearchQuery}
                onChange={(e) => setSalesSearchQuery(e.target.value)}
                placeholder="Cari Sales..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-[#3b0764]"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto min-h-[250px] pr-2 space-y-1">
              {filteredSalesOptions.map(opt => {
                const isSelected = tempSelectedSales.includes(opt.value);
                return (
                  <div 
                    key={opt.value}
                    onClick={() => toggleSalesSelection(opt.value)}
                    className={clsx(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors border",
                      isSelected 
                        ? "bg-purple-50/50 border-[#3b0764]/20 text-[#3b0764]" 
                        : "border-transparent hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    <div>
                      <p className="font-medium text-[14px]">{opt.label}</p>
                      {opt.subLabel && <p className="text-[12px] text-gray-400 mt-0.5">{opt.subLabel}</p>}
                    </div>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4.5 h-4.5 rounded border-gray-300 text-[#3b0764] focus:ring-[#3b0764]"
                    />
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3 mt-6 border-t pt-4">
              <button onClick={handleCloseSalesModal} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-[14px] font-bold hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSaveSalesModal} className="flex-1 py-2.5 bg-[#3b0764] hover:bg-[#2e054e] text-white rounded-xl text-[14px] font-bold transition-colors">
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
      
      <SupervisorModal 
        isOpen={isSupervisorModalOpen}
        onClose={() => setIsSupervisorModalOpen(false)}
        mode={selectedSupervisor ? 'detail' : 'edit'}
        data={selectedSupervisor}
        onSave={handleCreateOrUpdateModal}
      />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Supervisor.xlsx" 
      />

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-8">Apakah Anda ingin menyimpan data tersebut?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
              >
                Tidak
              </button>
              <button 
                onClick={handleConfirmSimpan}
                className="w-[120px] bg-[#52b788] hover:bg-[#40916c] text-white py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
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
                className="w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
              >
                Tidak
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors cursor-pointer"
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
