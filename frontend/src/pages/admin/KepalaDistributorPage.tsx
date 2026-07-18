import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Filter, Eye, CheckCircle2, XCircle, Plus, User, UserCircle, Mail, Phone, Lock, EyeOff, Map, Info, Save, MapPin, Trash2 } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { KepalaDistributorModal } from '../../components/ui/KepalaDistributorModal';
import { kepalaDistributorKpiData, kepalaDistributorTableData } from '../../mock/kepalaDistributor';

export const KepalaDistributorPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [status, setStatus] = useState('Semua Status');
  const [kepalaDistributor, setKepalaDistributor] = useState('Semua Kepala Distributor');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isKepalaDistributorModalOpen, setIsKepalaDistributorModalOpen] = useState(false);
  const [selectedKepalaDistributor, setSelectedKepalaDistributor] = useState<any>(null);

  // Form states for inline editing
  const [editNamaKepalaDistributor, setEditNamaKepalaDistributor] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNomorHp, setEditNomorHp] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editPassword, setEditPassword] = useState('**********');
  const [editArea, setEditArea] = useState('Jawa Barat');
  const [editStatus, setEditStatus] = useState('Aktif');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

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
          setSelectedKepalaDistributor(null);
          setIsKepalaDistributorModalOpen(true);
        }}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Distributor
      </button>
    </div>
  );

  const tableColumns = [
    { key: 'namaKepalaDistributor', label: 'Nama Kepala Distributor' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'status', label: 'Status' },
    { key: 'tanggalBergabung', label: 'Tanggal Bergabung' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaKepalaDistributor':
        return <span className="text-gray-700 font-medium">{item.namaKepalaDistributor}</span>;
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
              setSelectedKepalaDistributor(item);
              setIsKepalaDistributorModalOpen(true);
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

  const isAllKepalaDistributor = kepalaDistributor === 'Semua Kepala Distributor';
  const selectedData = kepalaDistributorTableData.find(k => k.namaKepalaDistributor === kepalaDistributor) || kepalaDistributorTableData[0];

  useEffect(() => {
    if (!isAllKepalaDistributor && selectedData) {
      setEditNamaKepalaDistributor(selectedData.namaKepalaDistributor || '');
      setEditUsername(selectedData.email?.split('@')[0] || '');
      setEditEmail(selectedData.email || '');
      setEditNomorHp(selectedData.nomorHp || '');
      setEditAlamat('Jl. Pahlawan No. 45'); // mock
      setEditPassword('**********');
      setEditArea(selectedData.area || 'Jawa Barat');
      setEditStatus(selectedData.status || 'Aktif');
      setShowPassword(false);
    }
  }, [selectedData, isAllKepalaDistributor]);

  return (
    <>
      <MainLayout>
        <Topbar 
          title="Kepala Distributor" 
          subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB"
          actionButton={ActionButtons}
        />
        
        <div className="px-8 pb-10">
          
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
            {kepalaDistributorKpiData.map((kpi) => (
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
                  options={['Semua Area', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera', 'DKI Jakarta']}
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
                <label className="block text-sm text-[#475569] font-medium mb-2">Kepala Distributor</label>
                <CustomSelect 
                  value={kepalaDistributor}
                  onChange={setKepalaDistributor}
                  options={['Semua Kepala Distributor', 'Bambang', 'Hendra', 'Dedi', 'Anton', 'Gery']}
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
          {isAllKepalaDistributor ? (
            <DataTable
              title="Tabel Kepala Distributor"
              columns={tableColumns}
              data={kepalaDistributorTableData}
              renderCell={renderCell}
            />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
              <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Kepala Distributor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Nama Kepala Distributor</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={18} />
                    </div>
                    <input type="text" value={editNamaKepalaDistributor} onChange={(e) => setEditNamaKepalaDistributor(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" />
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
                    value={editArea} onChange={setEditArea} options={['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Sumatera', 'DKI Jakarta']} 
                    icon={<Map size={18} />} showSearch={false} triggerClassName="flex items-center justify-between w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors" 
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
        fileName="Data_Kepala_Distributor.xlsx" 
      />

      <KepalaDistributorModal 
        isOpen={isKepalaDistributorModalOpen} 
        onClose={() => setIsKepalaDistributorModalOpen(false)}
        data={selectedKepalaDistributor}
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
