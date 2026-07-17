import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Plus, CheckCircle2, XCircle, Eye, Filter } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { salesAdminKpiData, salesAdminTableData } from '../../mock/salesAdmin';
import { SalesModal } from '../../components/ui/SalesModal';
import { ExportModal } from '../../components/ui/ExportModal';

export const SalesPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');
  const [status, setStatus] = useState('Semua Status');
  const [salesName, setSalesName] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'detail'>('create');
  const [selectedSales, setSelectedSales] = useState<any>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Plus size={18} />
        Tambah Sales
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
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const parseIndonesianDate = (dateStr: string) => {
    const months = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5,
      'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return 0;
    const [day, monthStr, year] = parts;
    return new Date(parseInt(year), (months as any)[monthStr] || 0, parseInt(day)).getTime();
  };

  const sortedSalesData = [...salesAdminTableData].sort((a, b) => {
    return parseIndonesianDate(b.tanggalBergabung) - parseIndonesianDate(a.tanggalBergabung);
  });

  return (
    <>
      <MainLayout>
        <Topbar title="Sales" subtitle="List Sales Active" actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          
          {/* Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <CustomSelect 
                  value={area} 
                  onChange={setArea} 
                  options={['Semua Area', 'Cirebon', 'Bandung', 'Jakarta']} 
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
                  options={['Semua Supervisor', 'Hartono', 'Budi']} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
                <CustomSelect 
                  value={salesName} 
                  onChange={setSalesName} 
                  options={['Semua Sales', 'Santoso', 'Heri']} 
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

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {salesAdminKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Table Section */}
          <DataTable
            title="Tabel Sales"
            columns={tableColumns}
            data={sortedSalesData}
            renderCell={renderCell}
          />

        </div>
      </MainLayout>
      
      <SalesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        data={selectedSales}
        onSave={(data) => {
          console.log('Saved data:', data);
          setIsModalOpen(false);
        }}
      />

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Sales.xlsx" 
      />
    </>
  );
};
