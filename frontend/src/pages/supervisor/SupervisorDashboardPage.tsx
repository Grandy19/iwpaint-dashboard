import React, { useState, useMemo } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ChartCard } from '../../components/ui/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import clsx from 'clsx';

import { 
  supervisorKpiData, 
  supervisorRingkasanTargetData, 
  supervisorTargetRealisasiData, 
  supervisorTopProductsData,
  supervisorChartData,
  supervisorTableData
} from '../../mock/supervisorDashboard';

export const SupervisorDashboardPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('30 Juni 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');

  const isAllKategori = kategoriProduk === 'Semua Kategori';

  const ringkasanTargetTitle = isAllKategori ? "Ringkasan Keseluruhan Target" : `Ringkasan Target ${kategoriProduk}`;
  const targetRealisasiTitle = isAllKategori ? "Target vs Realisasi Bulan Ini" : `Target vs Realisasi ${kategoriProduk} Bulan Ini`;
  
  const displayKpiData = supervisorKpiData;
  const displayRingkasanTarget = supervisorRingkasanTargetData;
  const displayTargetRealisasi = isAllKategori 
    ? supervisorTargetRealisasiData 
    : supervisorTargetRealisasiData.filter(item => item.title === kategoriProduk);
  const displayTopProducts = supervisorTopProductsData;

  const dynamicChartData = useMemo(() => {
    if (chartPeriode === 'Hari') {
      const baseData = Array.from({ length: 30 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
          date: `${day}/07/2026`,
          value: Math.floor(40000000 + Math.random() * 60000000)
        };
      });
      for (let i = 0; i < supervisorChartData.length; i++) {
        baseData[i] = supervisorChartData[i];
      }
      if (chartJenisData === 'Total Qty') {
        return baseData.map(item => ({ ...item, value: item.value / 10000 }));
      }
      return baseData;
    } else if (chartPeriode === 'Bulan') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      return months.map(m => ({
        date: m,
        value: Math.floor(400000000 + Math.random() * 600000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    } else if (chartPeriode === 'Tahun') {
      const years = ['2023', '2024', '2025', '2026'];
      return years.map(y => ({
        date: y,
        value: Math.floor(400000000 + Math.random() * 600000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    }
    return supervisorChartData;
  }, [chartPeriode, chartJenisData]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const supervisorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor-dashboard' },
    { name: 'Sales', icon: User, path: '/supervisor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/supervisor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/supervisor-dashboard/target-sales' },
  ];

  const tableColumns = [
    { key: 'sales', label: 'Sales' },
    { key: 'target', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
    { key: 'pencapaian', label: 'Pencapaian %' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'pencapaian':
        const val = item.pencapaian;
        const colorClass = val >= 100 ? 'text-[#10b981]' : val >= 80 ? 'text-[#52b788]' : 'text-[#ef4444]';
        return <span className={clsx("font-bold", colorClass)}>{val}%</span>;
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
    <MainLayout sidebarItems={supervisorMenuItems}>
      <Topbar title="Dashboard Supervisor" subtitle="Selamat Datang, Gunawan!" actionButton={ActionButtons} />

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
                    options={['30 Juni 2026', '01 Juli 2026', '02 Juli 2026']} 
                    showSearch={true}
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={periodeAkhir} 
                    onChange={setPeriodeAkhir} 
                    options={['30 Juni 2026', '01 Juli 2026', '02 Juli 2026']} 
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

        {/* Target vs Realisasi Section */}
        <div className="mb-8">
          <TargetRealisasiCard data={displayTargetRealisasi} title={targetRealisasiTitle} />
        </div>

        {/* Chart Area */}
        <div className="mb-8">
          <ChartCard 
            data={dynamicChartData} 
            title="Tren Penjualan Tim"
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
            filterAktifLabel={`${periodeAwal} - ${periodeAkhir}`}
          />
        </div>

        {/* Tabel Performa Sales */}
        <div className="mb-8">
          <DataTable
            title="Tabel Performa Sales"
            columns={tableColumns}
            data={supervisorTableData}
            renderCell={renderTableCell}
          />
        </div>

        {/* Top 10 Produk */}
        <TopProductsCard data={displayTopProducts} title="Top 10 Produk Terlaris Tim" />

      </div>
    </MainLayout>
  );
};
