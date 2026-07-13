import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Topbar } from '../components/layout/Topbar';
import { useFilterStore } from '../store/useFilterStore';
import { Filter, TrendingUp, Package, Banknote, Wallet, Download } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { SalesTable } from '../components/charts/sales/SalesTable';
import { SalesDonutChart } from '../components/charts/sales/SalesDonutChart';
import { formatShortCurrency, formatShortNumber } from '../utils/formatters';
import { SalesTrendChart } from '../components/charts/sales/SalesTrendChart';
import { SalesTopProductsChart } from '../components/charts/sales/SalesTopProductsChart';
import { SalesTransactionTable } from '../components/charts/sales/SalesTransactionTable';
import { Link } from 'react-router-dom';

export const SalesPage = () => {
  const { 
    startDate, endDate, location, sales, product,
    setStartDate, setEndDate, setLocation, setSales, setProduct
  } = useFilterStore();

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

  const ImportButton = (
    <Link 
      to="/import" 
      className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Import Data
    </Link>
  );

  return (
    <MainLayout>
      <Topbar title="Dashboard Monitoring Sales" actionButton={ImportButton} />

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

        {sales === 'Fransiskus' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Penjualan (Rp)</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Banknote size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortCurrency(250000000)}</h2>
                <span className="text-xs text-[#10b981] flex items-center gap-1">
                  <TrendingUp size={12} /> +8.4% dibanding bulan lalu
                </span>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Qty Penjualan</span>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(350)}</h2>
                <span className="text-xs text-gray-400">Periode Juni 2026</span>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Customer yang Dilayani</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(12)} Customer</h2>
                <span className="text-xs text-gray-400">Total keseluruhan</span>
              </div>
            </div>

            <div className="col-span-1">
              <SalesDonutChart />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Total Penjualan (Rp)</span>
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
                  <span className="text-gray-500 text-sm">Total Qty Terjual</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(56890)} Kg</h2>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{formatShortNumber(1245)}</h2>
                <span className="text-xs text-gray-400">Periode Juni 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SalesTable />
              <SalesDonutChart />
            </div>
          </>
        )}

        {/* Bottom Rows */}
        <SalesTrendChart />
        <SalesTopProductsChart />
        
        {sales === 'Fransiskus' && <SalesTransactionTable />}

      </div>
    </MainLayout>
  );
};
