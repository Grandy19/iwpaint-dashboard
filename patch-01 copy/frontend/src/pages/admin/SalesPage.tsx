import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Plus, CheckCircle2, XCircle, Eye, Filter, User, UserCircle, Mail, Phone, Lock, Map, MapPin, Briefcase, Users, Info, EyeOff, Save, Trash2 } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { SalesModal } from '../../components/ui/SalesModal';
import { ExportModal } from '../../components/ui/ExportModal';
import api from '../../utils/api';

export const SalesPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');
  const [status, setStatus] = useState('Semua Status');
  const [salesName, setSalesName] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'detail'>('create');
  const [selectedSales, setSelectedSales] = useState<any>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic dropdown options
  const [areaOptions, setAreaOptions] = useState<string[]>(['Semua Area']);
  const [supervisorOptions, setSupervisorOptions] = useState<string[]>(['Semua Supervisor']);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);

  // Sales data list
  const [salesData, setSalesData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);

  // Form states for inline editing
  const [editNamaSales, setEditNamaSales] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNomorHp, setEditNomorHp] = useState('');
  const [editPassword, setEditPassword] = useState('**********');
  const [editAlamat, setEditAlamat] = useState('Jl. Jendral Sudirman No. 123');
  const [editArea, setEditArea] = useState('Bandung');
  const [editRole, setEditRole] = useState('Sales');
  const [editSupervisor, setEditSupervisor] = useState('Andi');
  const [editStatus, setEditStatus] = useState('Aktif');
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const loadData = async () => {
    try {
      // Load sales
      const salesRes = await api.get('/users?role=sales');
      const allSales = salesRes.data.data;
      setSalesData(allSales);

      // Load supervisors
      const supervisorRes = await api.get('/users?role=supervisor');
      const allSupervisors = supervisorRes.data.data;

      // Populate filters
      const uniqueAreas = Array.from(new Set(allSales.map((s: any) => s.area).filter(Boolean))) as string[];
      setAreaOptions(['Semua Area', ...uniqueAreas]);
      setSupervisorOptions(['Semua Supervisor', ...allSupervisors.map((s: any) => s.namaSupervisor)]);
      setSalesOptions(['Semua Sales', ...allSales.map((s: any) => s.namaSales)]);

      // Calculate KPIs
      const totalCount = allSales.length;
      const activeCount = allSales.filter((s: any) => s.status === 'Aktif').length;
      const inactiveCount = totalCount - activeCount;

      setKpis([
        {
          id: 1,
          title: 'Total Sales',
          value: `${totalCount} Sales`,
          description: 'Total sales aktif yang terdaftar',
          icon: User,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Sales Aktif',
          value: `${activeCount} Sales`,
          description: 'Sales dengan Status Aktif',
          icon: CheckCircle2,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Sales Tidak Aktif',
          value: `${inactiveCount} Sales`,
          description: 'Sales dengan Status Tidak Aktif dalam Sebulan Terakhir',
          icon: XCircle,
          iconColor: 'text-[#ef4444]',
          iconBg: 'bg-[#fee2e2]',
        }
      ]);
    } catch (err) {
      console.error('Failed to load sales data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimpanClick = () => setShowConfirm(true);

  const handleConfirmSimpan = async () => {
    setShowConfirm(false);
    try {
      if (selectedSalesData) {
        await api.put(`/users/${selectedSalesData.id}`, {
          namaSales: editNamaSales,
          username: editUsername,
          email: editEmail,
          nomorHp: editNomorHp,
          password: editPassword,
          area: editArea,
          supervisor: editSupervisor,
          status: editStatus,
        });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          loadData();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      if (selectedSalesData) {
        await api.delete(`/users/${selectedSalesData.id}`);
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
          setSalesName('Semua Sales');
          loadData();
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleCreateOrUpdateModal = async (formData: any) => {
    try {
      if (modalMode === 'create') {
        await api.post('/users', { ...formData, role: 'sales' });
      } else if (selectedSales) {
        await api.put(`/users/${selectedSales.id}`, formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save user via modal:', err);
    }
  };

  const ActionButtons = (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setIsExportModalOpen(true)}
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => {
          setSelectedSales(null);
          setModalMode('create');
          setIsModalOpen(true);
        }}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        Sales
      </button>
    </div>
  ); 

  const tableColumns = [
    { key: 'namaSales', label: 'Nama Sales' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'status', label: 'Status' },
    { key: 'tanggalBergabung', label: 'Tanggal Bergabung' },
    { key: 'action', label: 'Detail' },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSales':
        return <span className="text-gray-700 font-medium">{item.namaSales}</span>;
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
              setSelectedSales(item);
              setModalMode('detail');
              setIsModalOpen(true);
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

  const isAllSales = salesName === 'Semua Sales';
  const filteredSalesData = salesData.filter((s: any) => {
    if (area !== 'Semua Area' && s.area !== area) return false;
    if (status !== 'Semua Status' && s.status !== status) return false;
    if (supervisor !== 'Semua Supervisor' && s.supervisor !== supervisor) return false;
    return true;
  });

  const selectedSalesData = (!isAllSales ? salesData.find(s => s.namaSales === salesName) : null) as any;

  useEffect(() => {
    if (!isAllSales && selectedSalesData) {
      setEditNamaSales(selectedSalesData.namaSales || '');
      setEditUsername(selectedSalesData.username || '');
      setEditEmail(selectedSalesData.email || '');
      setEditNomorHp(selectedSalesData.nomorHp || '');
      setEditAlamat(selectedSalesData.alamat || 'Jl. Jendral Sudirman No. 123');
      setEditArea(selectedSalesData.area || 'Bandung');
      setEditRole('Sales');
      setEditSupervisor(selectedSalesData.supervisor || 'Andi');
      setEditStatus(selectedSalesData.status || 'Aktif');
      setEditPassword('**********');
      setShowPassword(false);
    }
  }, [selectedSalesData, isAllSales]);

  return (
    <>
      <MainLayout>
        <Topbar title="Sales" subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB" actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
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
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
                <CustomSelect 
                  value={salesName} 
                  onChange={setSalesName} 
                  options={salesOptions} 
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
          {isAllSales ? (
            <DataTable
              title="Tabel Sales"
              columns={tableColumns}
              data={filteredSalesData}
              renderCell={renderCell}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
              <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Sales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Nama Sales</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input type="text" value={editNamaSales} onChange={(e) => setEditNamaSales(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
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
                  <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
                  <CustomSelect 
                    value={editSupervisor} onChange={setEditSupervisor} options={supervisorOptions.filter(opt => opt !== 'Semua Supervisor')} 
                    icon={<Users size={18} />} showSearch={false} triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors" 
                  />
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
      
      <SalesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        data={selectedSales}
        onSave={handleCreateOrUpdateModal}
      />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Sales.xlsx" 
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
