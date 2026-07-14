import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Topbar } from '../components/layout/Topbar';
import { useFilterStore } from '../store/useFilterStore';
import { Filter, TrendingUp, Package, Activity, Wallet, Download, Banknote, Upload } from 'lucide-react';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { SalesBarChart } from '../components/charts/SalesBarChart';
import { ImportModal } from '../components/ui/ImportModal';
import { ExportModal } from '../components/ui/ExportModal';
import { formatShortCurrency, formatShortNumber } from '../utils/formatters';
import { CustomSelect } from '../components/ui/CustomSelect';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const { 
    startDate, endDate, location, product,
    setStartDate, setEndDate, setLocation, setProduct
  } = useFilterStore();

  const startDateOptions = [
    '01 Juli 2026',
    '01 Juni 2026'
  ];

  const endDateOptions = [
    '30 Juni 2026',
    '31 Juli 2026'
  ];
  
  const locationOptions = [
    'Semua Lokasi',
    'Kabupaten Bandung',
    'Kota Bandung',
    'Kota Cimahi'
  ];

  const productOptions = [
    'Semua Kategori',
    'Otomotif',
    'Dekoratif'
  ];

  const ActionButtons = (
    <div className="flex items-center gap-4">
      <button 
        className="bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        onClick={() => setIsExportModalOpen(true)}
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => setIsImportModalOpen(true)}
        className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Download size={18} />
        Import Data
      </button>
    </div>
  );

  return (
    <MainLayout>
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <Topbar title="Dashboard Monitoring Penjualan" actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect 
                    value={startDate} 
                    onChange={setStartDate} 
                    options={startDateOptions} 
                  />
                </div>
                <span className="text-gray-500 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={endDate} 
                    onChange={setEndDate} 
                    options={endDateOptions} 
                  />
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Lokasi</label>
              <CustomSelect 
                value={location} 
                onChange={setLocation} 
                options={locationOptions} 
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Kategori Produk</label>
              <CustomSelect 
                value={product} 
                onChange={setProduct} 
                options={productOptions} 
              />
            </div>
            <div className="col-span-1">
              <button className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Filter size={18} />
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Total Penjualan (Rp)</span>
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <Banknote size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortCurrency(2450000000)}</h2>
            <span className="text-xs text-gray-400">
              Rp 2.450.000.000
            </span>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Total Qty Terjual</span>
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <Package size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{(56890).toLocaleString('id-ID')} Kg</h2>
            <span className="text-xs text-gray-400">
              Total produk terjual
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-500 text-sm">Total Transaksi</span>
              <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                <Wallet size={20} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{(1245).toLocaleString('id-ID')} Transaksi</h2>
            <span className="text-xs text-gray-400">Total transaksi penjualan</span>
          </div>
        </div>

        {/* Top Products & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top 10 Products Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Top 10 Produk Terlaris</h3>
            <div className="overflow-y-auto overflow-x-hidden max-h-[260px] custom-scroll pr-2">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <tr>
                    <th className="pb-3 font-normal">No.</th>
                    <th className="pb-3 font-normal">Kode Produk</th>
                    <th className="pb-3 font-normal">Produk</th>
                    <th className="pb-3 font-normal text-right">Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">01</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT123</span></td>
                    <td className="py-3 font-medium text-gray-900">Wiratex</td>
                    <td className="py-3 text-right">Rp1.200.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">02</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT124</span></td>
                    <td className="py-3 font-medium text-gray-900">Petalac</td>
                    <td className="py-3 text-right">Rp980.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">03</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT125</span></td>
                    <td className="py-3 font-medium text-gray-900">Crystal Coat</td>
                    <td className="py-3 text-right">Rp850.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">04</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT126</span></td>
                    <td className="py-3 font-medium text-gray-900">Shintex</td>
                    <td className="py-3 text-right">Rp700.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">05</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT127</span></td>
                    <td className="py-3 font-medium text-gray-900">Protex</td>
                    <td className="py-3 text-right">Rp650.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">06</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT128</span></td>
                    <td className="py-3 font-medium text-gray-900">Glosstex</td>
                    <td className="py-3 text-right">Rp500.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">07</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT129</span></td>
                    <td className="py-3 font-medium text-gray-900">Matex</td>
                    <td className="py-3 text-right">Rp420.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">08</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT130</span></td>
                    <td className="py-3 font-medium text-gray-900">DuraCoat</td>
                    <td className="py-3 text-right">Rp380.000.000</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-600">09</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT131</span></td>
                    <td className="py-3 font-medium text-gray-900">EcoPaint</td>
                    <td className="py-3 text-right">Rp290.000.000</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-600">10</td>
                    <td className="py-3 text-gray-500"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">CT132</span></td>
                    <td className="py-3 font-medium text-gray-900">AquaShield</td>
                    <td className="py-3 text-right">Rp210.000.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Distribusi Penjualan Berdasarkan Kategori Produk</h3>
            <div className="h-64 flex flex-col">
              <div className="flex-1 min-h-0">
                <CategoryPieChart />
              </div>
            </div>
          </div>
        </div>

        {/* Trend Line Chart */}
        <TrendLineChart />

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-900 mb-8 text-lg">Penjualan per Sales</h3>
          <div className="h-[400px]">
            <SalesBarChart />
          </div>
        </div>

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName="Data Dashboard" />
    </MainLayout>
  );
};
