import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, CheckCircle, CheckCircle2, XCircle, FileText, Search, Filter, Eye, Upload } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ImportModal } from '../../components/ui/ImportModal';
import { ExportModal } from '../../components/ui/ExportModal';
import { Link } from 'react-router-dom';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { kpiData } from '../../mock/dashboard';

export const ImportDataPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState('');
  
  const [startDate, setStartDate] = useState('01 Juli 2026');
  const [endDate, setEndDate] = useState('30 Juni 2026');
  const [status, setStatus] = useState('Berhasil');
  const [searchQuery, setSearchQuery] = useState('');

  const historyData = [
    { id: 1, name: 'Penjualan_Juli.xlsx', date: '13 Jul 2026 09:30', rows: '2.450', status: 'success' },
    { id: 2, name: 'Penjualan_Juni.xlsx', date: '27 Juni 2026 10:30', rows: '2.450', status: 'failed' },
    { id: 3, name: 'Penjualan_Mei.xlsx', date: '10 Mei 2026 11:30', rows: '2.680', status: 'success' },
    { id: 4, name: 'Penjualan_April.xlsx', date: '29 April 2026 09:00', rows: '2.510', status: 'success' },
    { id: 5, name: 'Penjualan_Maret.xlsx', date: '23 Maret 2026 08:30', rows: '2.680', status: 'success' },
    { id: 6, name: 'Penjualan_Februari.xlsx', date: '14 Feb 2026 14:15', rows: '2.100', status: 'success' },
    { id: 7, name: 'Penjualan_Januari.xlsx', date: '30 Jan 2026 10:00', rows: '2.890', status: 'success' },
    { id: 8, name: 'Penjualan_Desember.xlsx', date: '28 Des 2025 15:45', rows: '3.120', status: 'success' },
    { id: 9, name: 'Penjualan_November.xlsx', date: '15 Nov 2025 09:20', rows: '2.750', status: 'failed' },
    { id: 10, name: 'Penjualan_Oktober.xlsx', date: '22 Okt 2025 11:10', rows: '2.430', status: 'success' },
    { id: 11, name: 'Penjualan_September.xlsx', date: '05 Sep 2025 13:30', rows: '2.660', status: 'success' },
    { id: 12, name: 'Penjualan_Agustus.xlsx', date: '18 Ags 2025 16:00', rows: '2.800', status: 'success' },
    { id: 13, name: 'Penjualan_Juli_2025.xlsx', date: '02 Jul 2025 10:45', rows: '2.950', status: 'success' },
    { id: 14, name: 'Penjualan_Juni_2025.xlsx', date: '25 Jun 2025 08:50', rows: '2.340', status: 'failed' },
    { id: 15, name: 'Penjualan_Mei_2025.xlsx', date: '12 Mei 2025 14:20', rows: '2.610', status: 'success' },
  ];

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      onClick={() => setIsImportModalOpen(true)}
    >
      <Download size={18} />
      Import Data
    </button>
  );

  const historyImportColumns = [
    { key: 'name', label: 'Nama File' },
    { key: 'date', label: 'Tanggal Import' },
    { key: 'rows', label: 'Jumlah Data' },
    { key: 'status', label: 'Status' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderHistoryCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return item.status === 'Berhasil' || item.status === 'success' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Berhasil
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Gagal
          </span>
        );
      case 'detail':
        return (
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors">
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <MainLayout>
      <Topbar 
        title="Riwayat Import" 
        subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB"
        actionButton={ActionButtons}
      />
      
      <div className="px-8 pb-10">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
          {kpiData.slice(0, 3).map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect 
                    value={startDate} 
                    onChange={setStartDate} 
                    options={['01 Juli 2026', '01 Juni 2026']} 
                  />
                </div>
                <span className="text-gray-500 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={endDate} 
                    onChange={setEndDate} 
                    options={['30 Juni 2026', '31 Juli 2026']} 
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
              <CustomSelect 
                value={status} 
                onChange={setStatus} 
                options={['Berhasil', 'Gagal', 'Semua Status']} 
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Cari Nama File</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b0764] focus:border-transparent placeholder-gray-400 h-[42px]"
                  placeholder="Cari Nama File ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
          title="Tabel Riwayat Import"
          columns={historyImportColumns}
          data={historyData}
          renderCell={renderHistoryCell}
        />
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName={exportFileName} />
    </MainLayout>
  );
};
