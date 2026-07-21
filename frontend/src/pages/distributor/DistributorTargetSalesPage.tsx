import { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { AreaTargetModal } from '../../components/ui/AreaTargetModal';
import { distributorMenuItems } from '../../mock/distributorDashboard';
import {
  distributorTargetKpiData,
  distributorTargetSummaryData,
  distributorTargetCategoryData,
  distributorTargetAreaPerformance,
  distributorTargetHistory
} from '../../mock/distributorTargetSales';

export const DistributorTargetSalesPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Kategori');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  const ActionButtons = (
    <button className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
      <Download size={18} />
      Export Data
    </button>
  );

  const areaColumns = [
    { key: 'area', label: 'Area' },
    { key: 'target', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
    { key: 'qty', label: 'Qty' },
    { key: 'pencapaian', label: 'Pencapaian' },
    { key: 'status', label: 'Status' },
    { key: 'detail', label: 'Detail' },
  ];

  const historyColumns = [
    { key: 'periode', label: 'Periode' },
    { key: 'target', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
    { key: 'pencapaian', label: 'Pencapaian' },
    { key: 'status', label: 'Status' },
  ];

  const renderStatusBadge = (status: string) => {
    const isTercapai = status === 'Tercapai';
    return isTercapai ? (
      <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
        <CheckCircle2 size={16} /> {status}
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
        <XCircle size={16} /> {status}
      </span>
    );
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return renderStatusBadge(item.status);
      case 'pencapaian':
        return <span className="font-semibold text-gray-700">{item.pencapaian}</span>;
      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedArea(item);
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
      <Topbar title="Target Penjualan" subtitle="Pantau pencapaian target penjualan seluruh area distribusi." actionButton={ActionButtons} />

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
                    options={['01 Juli 2026', '01 Juni 2026', '01 Mei 2026']} 
                    showSearch={false}
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={periodeAkhir} 
                    onChange={setPeriodeAkhir} 
                    options={['30 Juni 2026', '31 Juli 2026', '31 Agustus 2026']} 
                    showSearch={false}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={['Semua Area', 'Bandung', 'Cirebon', 'Kuningan']} 
                showSearch={true}
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={['Semua Kategori', 'Semua Supervisor', 'Didi', 'Rafael']} 
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

        {/* Top Section: KPIs and Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {distributorTargetKpiData.map((kpi) => (
                <KpiCard key={kpi.id} {...kpi} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 h-full">
            <RingkasanTargetCard 
              title="Ringkasan Target Bulan Ini" 
              {...distributorTargetSummaryData} 
            />
          </div>
        </div>

        {/* Target vs Realisasi Full Width */}
        <div className="mb-8">
          <TargetRealisasiCard 
            title="Target vs Realisasi Area Bulan Ini" 
            data={distributorTargetCategoryData} 
          />
        </div>

        {/* Performa Target per Area */}
        <div className="mb-8">
          <DataTable 
            title="Performa Target per Area"
            columns={areaColumns}
            data={distributorTargetAreaPerformance}
            renderCell={renderCell}
          />
        </div>

        {/* Riwayat Target Area */}
        <div className="mb-8">
          <DataTable 
            title="Riwayat Target"
            columns={historyColumns}
            data={distributorTargetHistory}
            renderCell={renderCell}
          />
        </div>

      </div>

      <AreaTargetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedArea}
      />
    </MainLayout>
  );
};
