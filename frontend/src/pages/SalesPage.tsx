import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Topbar } from '../components/layout/Topbar';
import { useFilterStore } from '../store/useFilterStore';
import { Filter, TrendingUp, Package, Banknote, Wallet, Download } from 'lucide-react';
import { CustomSelect } from '../components/ui/CustomSelect';
import { SalesTable } from '../components/charts/sales/SalesTable';
import { SalesDonutChart } from '../components/charts/sales/SalesDonutChart';
import { SalesTrendChart } from '../components/charts/sales/SalesTrendChart';
import { SalesTopProductsChart } from '../components/charts/sales/SalesTopProductsChart';
import { SalesTransactionTable } from '../components/charts/sales/SalesTransactionTable';
import { Link } from 'react-router-dom';

export const SalesPage = () => {
  const { 
    dateRange, location, sales, product,
    setDateRange, setLocation, setSales, setProduct
  } = useFilterStore();

  const dateOptions = [
    'Juni 1 - Juni 30, 2026',
    'Juli 1 - Juli 31, 2026'
  ];
  
  const locationOptions = [
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Rentang Tanggal</label>
              <CustomSelect 
                value={dateRange} 
                onChange={setDateRange} 
                options={dateOptions} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Lokasi</label>
              <CustomSelect 
                value={location} 
                onChange={setLocation} 
                options={locationOptions} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={setSales} 
                options={salesOptions} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-2">Kategori Produk</label>
              <CustomSelect 
                value={product} 
                onChange={setProduct} 
                options={categoryOptions} 
              />
            </div>
            <div>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rp 250.000.000</h2>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">5890 Kg</h2>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">350</h2>
                <span className="text-xs text-gray-400">Periode Juni 2026</span>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-500 text-sm">Customer yang Dilayani</span>
                  <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#10b981]">
                    <Package size={20} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">12 Customer</h2>
                <span className="text-xs text-gray-400">Customer yang dilayani</span>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Rp 2.450.000.000</h2>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">56.890 Kg</h2>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">1.245</h2>
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
