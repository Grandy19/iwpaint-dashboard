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
  ];

  return (
    <MainLayout>
      <Topbar 
        title="Riwayat Import" 
        actionButton={
          <button 
            className="flex items-center gap-2 bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Download size={18} />
            Import Data
          </button>
        }
      />
      
      <div className="px-8 pb-8">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1">
              <span className="text-sm text-gray-500 mb-2 block">Periode</span>
              <div className="flex items-center gap-2">
                <CustomSelect 
                  value={startDate} 
                  onChange={setStartDate} 
                  options={['01 Juli 2026', '01 Juni 2026']} 
                />
                <span className="text-gray-400">-</span>
                <CustomSelect 
                  value={endDate} 
                  onChange={setEndDate} 
                  options={['30 Juni 2026', '31 Juli 2026']} 
                />
              </div>
            </div>
            
            <div className="w-48">
              <span className="text-sm text-gray-500 mb-2 block">Status</span>
              <CustomSelect 
                value={status} 
                onChange={setStatus} 
                options={['Berhasil', 'Gagal', 'Semua Status']} 
              />
            </div>

            <div className="flex-1">
              <span className="text-sm text-gray-500 mb-2 block">Cari Nama File</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b0764] focus:border-transparent placeholder-gray-400"
                  placeholder="Cari Nama File ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <button className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]">
              <Filter size={18} />
              Terapkan
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm text-[#10b981] flex items-center gap-1">
              <CheckCircle size={14} /> 15 hasil ditemukan
            </span>
            <span className="text-sm text-gray-400">Filter Aktif:</span>
            <span className="text-sm bg-[#e0f2fe] text-[#0ea5e9] px-3 py-1 rounded-full">
              1 Juni 2026 - 30 Juni 2026
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-gray-700">Total File Import</span>
              <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <FileText size={16} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">128 File</h2>
            <span className="text-[10px] text-gray-400">Seluruh file yang pernah diimport</span>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-gray-700">Import Berhasil</span>
              <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <CheckCircle size={16} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">120 File</h2>
            <span className="text-[10px] text-gray-400">Status berhasil</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-bold text-gray-700">Import Gagal</span>
              <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#ef4444]">
                <XCircle size={16} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">8 File</h2>
            <span className="text-[10px] text-gray-400">Status Gagal</span>
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
                  <th className="pb-4 font-medium">Export</th>
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
                    <td className="py-4">
                      <button 
                        className="flex items-center gap-1.5 text-gray-500 hover:text-[#3b0764] transition-colors"
                        onClick={() => {
                          setExportFileName(item.name);
                          setIsExportModalOpen(true);
                        }}
                      >
                        <Upload size={16} />
                        <span>Export</span>
                      </button>
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
