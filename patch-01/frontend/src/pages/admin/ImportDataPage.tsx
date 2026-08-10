import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, CheckCircle, CheckCircle2, XCircle, FileText, Search, Filter, Eye, Upload } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ImportModal } from '../../components/ui/ImportModal';
import { ExportModal } from '../../components/ui/ExportModal';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { kpiData } from '../../mock/dashboard';

export const ImportDataPage = () => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFileName, setExportFileName] = useState('');
  
  const [startDate, setStartDate] = useState('2026-01-01');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [endDate, setEndDate] = useState('2026-12-30');
  const [status, setStatus] = useState('Berhasil');
  const [searchQuery, setSearchQuery] = useState('');

  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/import-history');
        const data = res.data.data.map((item: any) => ({
          id: item.id,
          name: item.file_name,
          date: new Date(item.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          rows: Number(item.processed_rows).toLocaleString('id-ID'),
          status: item.status === 'success' ? 'success' : 'failed'
        }));
        setHistoryData(data);
      } catch (err) {
        console.error("Gagal memuat riwayat import:", err);
      }
    };
    fetchHistory();
  }, []);

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
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const filteredHistoryData = historyData.filter((item) => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (status !== 'Semua Status') {
      const isSuccess = item.status === 'success' || item.status === 'Berhasil';
      if (status === 'Berhasil' && !isSuccess) return false;
      if (status === 'Gagal' && isSuccess) return false;
    }
    const rowDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    if (rowDate < start || rowDate > end) {
      return false;
    }
    return true;
  });

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
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="flex flex-nowrap gap-4 lg:gap-6 items-end overflow-x-auto pb-2">
            <div className="w-[280px] lg:w-[400px] flex-none">
              <label className="block text-sm text-[#475569] font-medium mb-2 whitespace-nowrap">Periode</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 500);
                    }} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" 
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 500);
                    }} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors" 
                  />
                </div>
              </div>
            </div>
            
            {/* Modern Divider */}
            <div className="hidden sm:block w-[2px] h-[32px] bg-slate-200 rounded-full mb-[5px] -ml-2 mr-2"></div>

            <div className="flex-1 min-w-[160px]">
              <label className="block text-sm text-[#475569] font-medium mb-2 whitespace-nowrap">Status</label>
              <CustomSelect 
                value={status} 
                onChange={setStatus} 
                options={['Semua Status', 'Berhasil', 'Gagal']} 
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-[#475569] font-medium mb-2 whitespace-nowrap">Cari Nama File</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b0764] focus:border-transparent placeholder-gray-400 h-[42px] transition-colors"
                  placeholder="Cari Nama File ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <DataTable
          title="Tabel Riwayat Import"
          columns={historyImportColumns}
          data={filteredHistoryData}
          renderCell={renderHistoryCell}
        />
      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName={exportFileName} />
    </MainLayout>
  );
};
