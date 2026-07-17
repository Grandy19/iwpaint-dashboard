import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { useFilterStore } from '../../store/useFilterStore';
import { Filter, TrendingUp, Package, Activity, Banknote, Wallet, Download, Upload } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomerTable } from '../../components/charts/customer/CustomerTable';
import { CustomerDonutChart } from '../../components/charts/customer/CustomerDonutChart';
import { formatShortCurrency, formatShortNumber } from '../../utils/formatters';
import { CustomerTrendChart } from '../../components/charts/customer/CustomerTrendChart';
import { CustomerTopProductsChart } from '../../components/charts/customer/CustomerTopProductsChart';
import { ImportModal } from '../../components/ui/ImportModal';
import { ExportModal } from '../../components/ui/ExportModal';
import { Link } from 'react-router-dom';

export const CustomerPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { 
    startDate, endDate, location, customer, product,
    setStartDate, setEndDate, setLocation, setCustomer, setProduct
  } = useFilterStore();

  const startDateOptions = ['01 Juli 2026', '01 Juni 2026'];
  const endDateOptions = ['30 Juni 2026', '31 Juli 2026'];
  
  const locationOptions = [
    'Semua Lokasi',
    'Kabupaten Bandung',
    'Kota Bandung',
    'Kota Cimahi'
  ];

  const customerOptions = [
    'Semua Customer',
    'PT AKD',
    'SUMBER JAYA',
    'TB SKJ'
  ];

  const categoryOptions = [
    'Semua Kategori',
    'Dekoratif',
    'Otomotif',
    'Proyek',
    'Industri'
  ];

  const ActionButtons = (
    <div className="flex items-center gap-4">
      <button 
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        onClick={() => setIsExportModalOpen(true)}
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => setIsImportModalOpen(true)}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Download size={18} />
        Import Data
      </button>
    </div>
  );

  return (
    <MainLayout>
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <Topbar title="Dashboard Monitoring Customer" actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
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
              <label className="block text-sm text-[#475569] font-medium mb-2">Customer</label>
              <CustomSelect 
                value={customer} 
                onChange={setCustomer} 
                options={customerOptions} 
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Kategori Produk</label>
              <CustomSelect 
                value={product} 
                onChange={setProduct} 
                options={categoryOptions} 
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

        {customer === 'PT AKD' && (
          <div className="mb-4 text-sm text-gray-500">
            Sales yang Menangani Customer: <span className="font-bold text-gray-800">014 | Sadang</span>
          </div>
        )}

        {customer === 'PT AKD' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Pembelian (Rp)</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Banknote size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortCurrency(450000000)}</h2>
                <span className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp size={12} /> +8.4% dibanding bulan lalu
                </span>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Qty Dibeli</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(5890)} Kg</h2>
                <span className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp size={12} /> +8.2% dibanding bulan lalu
                </span>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Transaksi</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Wallet size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{(350).toLocaleString('id-ID')} Transaksi</h2>
                <span className="text-xs text-gray-400">Total transaksi penjualan</span>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Pembelian Terakhir</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">30 Mei 2026</h2>
                <span className="text-xs text-gray-400">Transaksi terakhir dilakukan</span>
              </div>
            </div>

            <div className="col-span-1">
              <CustomerDonutChart />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Pembelian (Rp)</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Banknote size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortCurrency(2450000000)}</h2>
                <span className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp size={12} /> +8.4% dibanding bulan lalu
                </span>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Qty Dibeli</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(56890)} Kg</h2>
                <span className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp size={12} /> +6.2% dibanding bulan lalu
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <CustomerTable />
              <CustomerDonutChart />
            </div>
          </>
        )}

        {/* Bottom Rows */}
        <CustomerTrendChart />
        <CustomerTopProductsChart />

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName="Data Customer" />
    </MainLayout>
  );
};
