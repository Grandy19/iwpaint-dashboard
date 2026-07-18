import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';

import { ChartCard } from '../../components/ui/ChartCard';

import { 
  salesDashboardKpiData, 
  salesRingkasanTargetData, 
  salesTargetRealisasiData, 
  salesTopProductsData,
  salesChartData
} from '../../mock/salesDashboard';

export const SalesDashboardPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('01 Juli 2026');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');

  const isAll = kategoriProduk === 'Semua Kategori';

  const ringkasanTargetTitle = isAll ? "Ringkasan Keseluruhan Target" : `Ringkasan Target ${kategoriProduk}`;
  const targetRealisasiTitle = isAll ? "Target vs Realisasi Bulan Ini" : `Target vs Realisasi ${kategoriProduk} Bulan Ini`;
  const topProductsTitle = isAll ? "Top 10 Produk Terlaris Penjualan Customer" : `Top 10 Produk Terlaris Penjualan Customer Kategori ${kategoriProduk}`;
  const chartCardTitle = isAll ? "Tren Pembelian Customer" : `Tren Pembelian Customer Kategori ${kategoriProduk}`;

  const displayKpiData = salesDashboardKpiData.map(kpi => ({
    ...kpi,
    value: isAll ? kpi.value : (kpi.id === 1 ? 'Rp 120.000.000' : kpi.id === 2 ? '2400 Kg' : kpi.id === 3 ? '180' : '5 Customer')
  }));

  const displayRingkasanTarget = isAll ? salesRingkasanTargetData : {
    percentage: 45,
    targetGlobal: 'Rp 120 Jt',
    realisasi: 'Rp 54 Jt',
    selisih: 'Rp 66 Jt',
  };

  const displayTargetRealisasi = isAll 
    ? salesTargetRealisasiData 
    : salesTargetRealisasiData.filter(item => item.title === kategoriProduk);

  const displayTopProducts = isAll 
    ? salesTopProductsData 
    : salesTopProductsData.map(item => ({
        ...item,
        value: item.value * 0.6,
        max: 80000000,
        label: `Rp ${(item.value * 0.6 / 1000000).toFixed(0)} Jt`
      }));

  const dynamicChartData = React.useMemo(() => {
    if (chartPeriode === 'Hari') {
      const baseData = Array.from({ length: 30 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
          date: `${day}/07/2026`,
          value: Math.floor(40000000 + Math.random() * 60000000)
        };
      });
      // Preserve original mock data for first 12 days
      for (let i = 0; i < salesChartData.length; i++) {
        baseData[i] = salesChartData[i];
      }
      if (chartJenisData === 'Total Qty') {
        return baseData.map(item => ({ ...item, value: item.value / 10000 }));
      }
      return baseData;
    } else if (chartPeriode === 'Bulan') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      return months.map(m => ({
        date: m,
        value: Math.floor(40000000 + Math.random() * 60000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    } else if (chartPeriode === 'Tahun') {
      const years = ['2023', '2024', '2025', '2026'];
      return years.map(y => ({
        date: y,
        value: Math.floor(400000000 + Math.random() * 600000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    }
    return salesChartData;
  }, [chartPeriode, chartJenisData]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const salesMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/sales-dashboard' },
    { name: 'Customer', icon: Users, path: '/sales-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/sales-dashboard/target' },
  ];

  return (
    <MainLayout sidebarItems={salesMenuItems}>
      <Topbar title="Dashboard Sales" subtitle="Selamat datang, Heri" actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <CustomSelect 
                    value={periodeAwal} 
                    onChange={setPeriodeAwal} 
                    options={['01 Juli 2026', '02 Juli 2026', '03 Juli 2026']} 
                    showSearch={true}
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={periodeAkhir} 
                    onChange={setPeriodeAkhir} 
                    options={['01 Juli 2026', '02 Juli 2026', '03 Juli 2026']} 
                    showSearch={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Kategori Produk</label>
              <CustomSelect 
                value={kategoriProduk} 
                onChange={setKategoriProduk} 
                options={['Semua Kategori', 'Decorative', 'Automotive', 'Industri']} 
                showSearch={true}
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

        {/* KPI and Ringkasan Target Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <RingkasanTargetCard {...displayRingkasanTarget} title={ringkasanTargetTitle} />
          </div>
        </div>

        {/* Target Realisasi Section */}
        <div className="mb-8">
          <TargetRealisasiCard data={displayTargetRealisasi} title={targetRealisasiTitle} />
        </div>

        {/* Chart Area */}
        <ChartCard 
          data={dynamicChartData} 
          title={chartCardTitle}
          jenisData={chartJenisData}
          setJenisData={setChartJenisData}
          periode={chartPeriode}
          setPeriode={setChartPeriode}
          filterAktifLabel="1 Juni 2026 - 30 Juni 2026"
        />

        {/* Top 10 Produk */}
        <TopProductsCard data={displayTopProducts} title={topProductsTitle} />

      </div>
    </MainLayout>
  );
};
