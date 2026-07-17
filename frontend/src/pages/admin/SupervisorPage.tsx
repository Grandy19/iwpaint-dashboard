import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Filter, Eye, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import { supervisorKpiData, supervisorTableData } from '../../mock/supervisor';

export const SupervisorPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [status, setStatus] = useState('Semua Status');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSupervisorModalOpen, setIsSupervisorModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

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
          <DataTable
            title="Tabel Supervisor"
            columns={tableColumns}
            data={supervisorTableData}
            renderCell={renderCell}
          />

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
    </>
  );
};
