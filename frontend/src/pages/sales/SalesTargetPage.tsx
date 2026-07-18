import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, LayoutDashboard, Users, Target, CheckCircle2, XCircle } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { DataTable } from '../../components/common/DataTable';

import { 
  salesTargetKpiData, 
  salesTargetRingkasanData, 
  salesTargetRealisasiData,
  salesTargetHistoryData
} from '../../mock/salesTarget';

export const SalesTargetPage = () => {
  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

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
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Tercapai
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Belum Tercapai
          </span>
        );
      default:
        return item[columnKey];
    }
  };

  const salesMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/sales-dashboard' },
    { name: 'Customer', icon: Users, path: '/sales-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/sales-dashboard/target' },
  ];

  return (
    <MainLayout sidebarItems={salesMenuItems}>
      <Topbar 
        title="Target Penjualan" 
        subtitle="Pantau pencapaian target penjualan Anda pada bulan ini." 
        actionButton={ActionButtons} 
      />

      <div className="px-8 pb-10">
        
        {/* Top Section: KPIs and Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-4">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salesTargetKpiData.map((kpi) => (
                <KpiCard key={kpi.id} {...kpi} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <RingkasanTargetCard {...salesTargetRingkasanData} />
          </div>
        </div>

        {/* Target vs Realisasi Full Width */}
        <div className="mb-8">
          <TargetRealisasiCard 
            data={salesTargetRealisasiData} 
            title="Target vs Realisasi" 
          />
        </div>

        {/* History Table */}
        <DataTable
          title="Tabel Riwayat Target"
          columns={historyColumns}
          data={salesTargetHistoryData}
          renderCell={renderHistoryCell}
        />

      </div>
    </MainLayout>
  );
};
