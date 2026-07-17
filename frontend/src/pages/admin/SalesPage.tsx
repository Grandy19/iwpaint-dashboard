import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { useFilterStore } from '../../store/useFilterStore';
import { Filter, TrendingUp, Package, Banknote, Wallet, Download, Users, Upload } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesTable } from '../../components/charts/sales/SalesTable';
import { SalesDonutChart } from '../../components/charts/sales/SalesDonutChart';
import { formatShortCurrency, formatShortNumber } from '../../utils/formatters';
import { TrendLineChart } from '../../components/charts/TrendLineChart';
import { SalesTopProductsChart } from '../../components/charts/sales/SalesTopProductsChart';
import { SalesTransactionTable } from '../../components/charts/sales/SalesTransactionTable';
import { SalesBarChart } from '../../components/charts/SalesBarChart';
import { ImportModal } from '../../components/ui/ImportModal';
import { ExportModal } from '../../components/ui/ExportModal';
import { Link } from 'react-router-dom';

export const SalesPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { 
    startDate, endDate, location, sales, product,
    setStartDate, setEndDate, setLocation, setSales, setProduct
  } = useFilterStore();

  const isFransiskus = sales === 'Fransiskus';
  const kpiData = isFransiskus ? {
    penjualan: 250000000,
    qty: 5890,
    transaksi: 350,
    customer: 380
  } : {
    penjualan: 2450000000,
    qty: 45890,
    transaksi: 1350,
    customer: 1280
  };

  const startDateOptions = ['01 Juli 2026', '01 Juni 2026'];
  const endDateOptions = ['30 Juni 2026', '31 Juli 2026'];
  
  const locationOptions = [
    'Semua Lokasi',
    'Kabupaten Bandung',
    'Kota Bandung',
    'Kota Cimahi'
  ];

  const salesOptions = [
    'Semua Sales',
    'Fransiskus',
    'Julianto',
    'Sadang',
    'Ken Y'
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
      <Topbar title="Dashboard Monitoring Sales" actionButton={ActionButtons} />

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
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={setSales} 
                options={salesOptions} 
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm">Total Penjualan (Rp)</span>
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                  <Banknote size={20} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortCurrency(kpiData.penjualan)}</h2>
              <span className="text-xs text-gray-400">
                Rp 2.450.000.000
              </span>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm">Total Qty Penjualan</span>
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                  <Package size={20} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{(kpiData.qty).toLocaleString('id-ID')} Kg</h2>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{(kpiData.transaksi).toLocaleString('id-ID')} Transaksi</h2>
              <span className="text-xs text-gray-400">Total transaksi penjualan</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm">Total Customer</span>
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                  <Users size={20} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{(kpiData.customer).toLocaleString('id-ID')} Customer</h2>
              <span className="text-xs text-gray-400">Customer yang dilayani</span>
            </div>
          </div>

          <div className="col-span-1">
            <SalesDonutChart />
          </div>
        </div>

        <TrendLineChart title="Tren Penjualan Sales" />
        <SalesTopProductsChart />
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-900 mb-8 text-lg">Penjualan per Sales</h3>
          <div className="h-[400px]">
            <SalesBarChart />
          </div>
        </div>

      </div>
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} fileName="Data Sales" />
    </MainLayout>
  );
};
