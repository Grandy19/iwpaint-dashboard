import React, { useState, useMemo } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye, Briefcase, UserCheck } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ChartCard } from '../../components/ui/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import clsx from 'clsx';

import { 
  distributorKpiData, 
  distributorRingkasanTargetData, 
  distributorTargetRealisasiData, 
  distributorTopProductsData,
  distributorChartData,
  distributorTableData,
  distributorMenuItems
} from '../../mock/distributorDashboard';

export const DistributorDashboardPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');

  const isAllKategori = kategoriProduk === 'Semua Kategori';

  const ringkasanTargetTitle = "Ringkasan Target Area";
  const targetRealisasiTitle = isAllKategori ? "Target vs Realisasi Area Bulan Ini" : `Target vs Realisasi ${kategoriProduk}`;
  
  const displayTargetRealisasi = isAllKategori 
    ? distributorTargetRealisasiData 
    : distributorTargetRealisasiData.filter(item => item.title === kategoriProduk);

  const dynamicChartData = useMemo(() => {
    if (chartPeriode === 'Hari') {
      const baseData = Array.from({ length: 30 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
          date: `${day}/07/2026`,
          value: Math.floor(40000000 + Math.random() * 60000000)
        };
      });
      for (let i = 0; i < distributorChartData.length; i++) {
        baseData[i] = distributorChartData[i];
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
    return distributorChartData;
  }, [chartPeriode, chartJenisData]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  // Menu items imported from mock

  const tableColumns = [
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'area', label: 'Area' },
    { key: 'target', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
    { key: 'qty', label: 'Qty' },
    { key: 'pencapaian', label: 'Pencapaian %' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'pencapaian':
        const val = item.pencapaian;
        const colorClass = val >= 80 ? 'text-[#10b981]' : val >= 60 ? 'text-[#eab308]' : 'text-[#ef4444]';
        return <span className={clsx("font-bold", colorClass)}>{val}%</span>;
      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedSupervisor({
                namaSupervisor: item.supervisor,
                area: item.area,
                target: item.target,
                realisasi: item.realisasi,
                jumlahSales: '12 Sales', // Default fallback
                email: `${item.supervisor.toLowerCase()}@distributor.com`,
                nomorHp: '081234567890',
                alamat: `Jl. Raya ${item.area} No. 123`
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <MainLayout sidebarItems={distributorMenuItems}>
      <Topbar title="Dashboard Kepala Distributor" subtitle="Selamat Datang, Bambang!" actionButton={ActionButtons} />

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
            {distributorKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <RingkasanTargetCard {...distributorRingkasanTargetData} title={ringkasanTargetTitle} />
          </div>
        </div>

        {/* Target vs Realisasi per Kategori */}
        <div className="mb-8">
          <TargetRealisasiCard data={displayTargetRealisasi} title={targetRealisasiTitle} />
        </div>

        {/* Chart Area */}
        <div className="mb-8">
          <ChartCard 
            data={dynamicChartData} 
            title="Tren Penjualan Area"
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
            filterAktifLabel={`${periodeAwal} - ${periodeAkhir}`}
          />
        </div>

        {/* Tabel Performa Supervisor */}
        <div className="mb-8">
          <DataTable
            title="Tabel Performa Supervisor"
            columns={tableColumns}
            data={distributorTableData}
            renderCell={renderTableCell}
          />
        </div>

        {/* Top 10 Produk */}
        <TopProductsCard data={distributorTopProductsData} title="Top 10 Produk Terlaris Area" />

      </div>

      <SupervisorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="view_only"
        data={selectedSupervisor}
      />
    </MainLayout>
  );
};
