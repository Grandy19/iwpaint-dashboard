import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { CheckCircle2, XCircle, Eye, Download } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { ProgressCard } from '../../components/common/ProgressCard';
import { DataTable } from '../../components/common/DataTable';
import { kpiData, progressData, historyImportData, recentActivityData } from '../../mock/dashboard';

export const DashboardPage = () => {
  const ActionButtons = (
    <button className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
      <Download size={18} />
      Import Data
    </button>
  );

  const renderHistoryCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="text-gray-700 font-medium">{item.name}</span>;
      case 'date':
        return item.date;
      case 'rows':
        return item.rows;
      case 'status':
        return item.status === 'Berhasil' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Berhasil
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Gagal
          </span>
        );
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

  const renderActivityCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'date':
        return item.date;
      case 'type':
        return item.type;
      case 'description':
        return item.description;
      case 'status':
        return item.status === 'Berhasil' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Berhasil
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Gagal
          </span>
        );
      case 'user':
        return item.user;
      default:
        return item[columnKey];
    }
  };

  return (
    <MainLayout>
      <Topbar title="Dashboard Admin" subtitle="Selamat Datang Admin" actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

          {/* Progress Card */}
          <ProgressCard {...progressData} />

          {/* History Table */}
          <DataTable
            title="Tabel Riwayat Import"
            columns={[
              { key: 'name', label: 'Nama File' },
              { key: 'date', label: 'Tanggal Import' },
              { key: 'rows', label: 'Jumlah Data' },
              { key: 'status', label: 'Status' },
              { key: 'detail', label: 'Detail' },
            ]}
            data={historyImportData}
            renderCell={renderHistoryCell}
          />

          {/* Activity Table */}
          <DataTable
            title="Aktivitas Terbaru"
            columns={[
              { key: 'date', label: 'Tanggal' },
              { key: 'type', label: 'Jenis Aktivitas' },
              { key: 'description', label: 'Deskripsi' },
              { key: 'status', label: 'Status' },
              { key: 'role', label: 'Role' },
              { key: 'username', label: 'Username' },
            ]}
            data={recentActivityData}
            renderCell={renderActivityCell}
          />
        </div>
    </MainLayout>
  );
};
