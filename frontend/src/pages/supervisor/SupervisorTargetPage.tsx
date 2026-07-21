import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, LayoutDashboard, Users, Target, CheckCircle2, XCircle, Filter, Eye, Banknote, Package, Wallet, User } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';

import { 
  supervisorTargetKpiData, 
  supervisorTargetRingkasanData, 
  supervisorTargetRealisasiData,
  supervisorTargetPerformanceData,
  supervisorTargetHistoryData
} from '../../mock/supervisorTargetSales';

export const SupervisorTargetPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('30 Juni 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [sales, setSales] = useState('Semua Sales');
  const [appliedSales, setAppliedSales] = useState('Semua Sales');
  
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);

  const displayPerformanceData = React.useMemo(() => {
    if (appliedSales !== 'Semua Sales') {
      return supervisorTargetPerformanceData.filter(item => item.namaSales === appliedSales);
    }
    return supervisorTargetPerformanceData;
  }, [appliedSales]);

  const displayKpiData = React.useMemo(() => {
    if (appliedSales !== 'Semua Sales') {
      return [
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: 'Rp 45 Jt',
          description: `Total penjualan ${appliedSales}`,
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Target Bulan Ini',
          value: 'Rp 60 Jt',
          description: `Target bulanan ${appliedSales}`,
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total QTY Penjualan',
          value: '1.250 Kg',
          description: `Total QTY dari ${appliedSales}`,
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 4,
          title: 'Total Transaksi',
          value: '120 Transaksi',
          description: `Total transaksi oleh ${appliedSales}`,
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ];
    }
    return supervisorTargetKpiData;
  }, [appliedSales]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const performaColumns = [
    { key: 'sales', label: 'Sales', className: 'w-[15%]' },
    { key: 'target', label: 'Target', className: 'w-[15%]' },
    { key: 'realisasi', label: 'Realisasi', className: 'w-[15%]' },
    { key: 'pencapaian', label: 'Pencapaian', className: 'w-[15%]' },
    { key: 'status', label: 'Status', className: 'w-[20%]' },
    { key: 'detail', label: 'Detail', className: 'w-[10%] text-center' },
  ];

  const renderPerformaCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'sales':
        return <span className="text-gray-800 font-semibold">{item.sales}</span>;
      case 'status':
        return item.status === 'Tercapai' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] text-sm font-medium">
            <CheckCircle2 size={16} /> Tercapai
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] text-sm font-medium">
            <XCircle size={16} /> Belum Tercapai
          </span>
        );
      case 'detail':
        return (
          <div className="flex justify-center">
            <button 
              onClick={() => {
                setSelectedSalesData(item);
                setShowSalesModal(true);
              }}
              className="flex items-center gap-1 text-gray-500 hover:text-[#3b0764] transition-colors"
            >
              <Eye size={16} />
              <span className="text-sm font-medium">Detail</span>
            </button>
          </div>
        );
      default:
        return <span className="text-gray-600">{item[columnKey]}</span>;
    }
  };

  const historyColumns = [
    { key: 'periode', label: 'Periode', className: 'w-[15%]' },
    { key: 'target', label: 'Target', className: 'w-[20%]' },
    { key: 'realisasi', label: 'Realisasi', className: 'w-[20%]' },
    { key: 'pencapaian', label: 'Pencapaian', className: 'w-[20%]' },
    { key: 'status', label: 'Status', className: 'w-[25%]' },
  ];

  const renderHistoryCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'periode':
        return <span className="text-gray-700 font-medium">{item.periode}</span>;
      case 'status':
        return item.status === 'Tercapai' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] text-sm font-medium">
            <CheckCircle2 size={16} /> Tercapai
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] text-sm font-medium">
            <XCircle size={16} /> Belum Tercapai
          </span>
        );
      default:
        return <span className="text-gray-600">{item[columnKey]}</span>;
    }
  };

  const supervisorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor-dashboard' },
    { name: 'Sales', icon: User, path: '/supervisor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/supervisor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/supervisor-dashboard/target-sales' },
  ];

  return (
    <MainLayout sidebarItems={supervisorMenuItems}>
      <Topbar 
        title="Target Sales" 
        subtitle="Pantau pencapaian target seluruh anggota tim sales" 
        actionButton={ActionButtons} 
      />

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
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={(val) => {
                  setSales(val);
                  setAppliedSales(val);
                }} 
                options={['Semua Sales', 'Budi', 'Fransiskus']} 
                showSearch={true}
              />
            </div>
            
            <div className="col-span-1">
              <button 
                onClick={() => setAppliedSales(sales)}
                className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]"
              >
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
              {displayKpiData.map((kpi) => (
                <KpiCard key={kpi.id} {...kpi} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 h-full">
            <RingkasanTargetCard {...supervisorTargetRingkasanData} title="Ringkasan Target Bulan Ini" />
          </div>
        </div>

        {/* Target vs Realisasi Full Width */}
        <div className="mb-8">
          <TargetRealisasiCard 
            data={supervisorTargetRealisasiData} 
            title="Target vs Realisasi Bulan Ini" 
          />
        </div>

        {/* Tabel Performa Target Sales */}
        {appliedSales === 'Semua Sales' && (
          <div className="mb-8">
            <DataTable
              title="Tabel Performa Target Sales"
              columns={performaColumns}
              data={displayPerformanceData}
              renderCell={renderPerformaCell}
            />
          </div>
        )}

        {/* History Table */}
        <div className="mb-8">
          <DataTable
            title="Riwayat Target"
            columns={historyColumns}
            data={supervisorTargetHistoryData}
            renderCell={renderHistoryCell}
          />
        </div>

      </div>

      <SalesModal 
        isOpen={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        mode="view_target"
        data={selectedSalesData}
      />
    </MainLayout>
  );
};
