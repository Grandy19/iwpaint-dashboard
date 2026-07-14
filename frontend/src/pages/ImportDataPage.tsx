import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Topbar } from '../components/layout/Topbar';
import { Download, CheckCircle, XCircle, FileText, Search, Filter, Eye, Upload } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { ImportModal } from '../components/ui/ImportModal';
import { ExportModal } from '../components/ui/ExportModal';
import { Link } from 'react-router-dom';

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

  return (
    <MainLayout>
      <Topbar 
        title="Riwayat Import" 
        actionButton={
          <div className="flex items-center gap-4">
            <button 
              className="bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              onClick={() => {
                setExportFileName('Data Riwayat Import');
                setIsExportModalOpen(true);
              }}
            >
              <Upload size={18} />
              Export Data
            </button>
            <button 
              className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Download size={18} />
              Import Data
            </button>
          </div>
        }
      />
      
      <div className="px-8 pb-8">
        
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

          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm text-[#10b981] flex items-center gap-1">
              <CheckCircle size={14} /> <span className="text-gray-500">15 hasil ditemukan</span>
            </span>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500">Filter Aktif:</span>
              <span className="text-sm font-medium bg-[#e0f2fe] text-[#0ea5e9] px-3 py-1 rounded-md">
                1 Juni 2026 - 30 Juni 2026
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Total File Import</span>
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <FileText size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">128 File</h2>
            <span className="text-xs text-gray-400">Seluruh file yang pernah diimport</span>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Import Berhasil</span>
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <CheckCircle size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">120 File</h2>
            <span className="text-xs text-gray-400">Status berhasil</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Import Gagal</span>
              <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444]">
                <XCircle size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">8 File</h2>
            <span className="text-xs text-gray-400">Status Gagal</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6 text-lg">Tabel Riwayat Import</h3>
          <div className="overflow-x-auto overflow-y-auto max-h-[400px] custom-scroll pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-400 border-b border-gray-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="pb-4 font-medium">Nama File</th>
                  <th className="pb-4 font-medium">Tanggal Import</th>
                  <th className="pb-4 font-medium">Jumlah Data</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Detail</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-gray-700">{item.name}</td>
                    <td className="py-4 text-gray-600">{item.date}</td>
                    <td className="py-4 text-gray-600">{item.rows}</td>
                    <td className="py-4">
                      {item.status === 'success' ? (
                        <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
                          <CheckCircle size={14} /> Berhasil
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
                          <XCircle size={14} /> Gagal
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <Link to="/" className="flex items-center gap-1.5 text-gray-500 hover:text-[#3b0764] transition-colors w-fit">
                        <Eye size={16} />
                        <span>Detail</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName={exportFileName} />
    </MainLayout>
  );
};
