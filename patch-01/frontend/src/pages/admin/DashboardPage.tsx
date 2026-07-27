import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { CheckCircle2, XCircle, Eye, Download, Wallet, CreditCard, Scale, Target, FileText, Users, User } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { ProgressCard } from '../../components/common/ProgressCard';
import { DataTable } from '../../components/common/DataTable';
import { ImportModal } from '../../components/ui/ImportModal';
import { TargetSalesModal } from '../../components/ui/TargetSalesModal';
import api from '../../utils/api';

export const DashboardPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const [kpis, setKpis] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [historyImports, setHistoryImports] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);

  const fetchData = async () => {
    try {
      const now = new Date();
      const targetYear = now.getFullYear();
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[now.getMonth()];

      const [txRes, targetsRes, historyRes, salesUsersRes, customersRes] = await Promise.all([
        api.get('/dashboard/total-transactions'),
        api.get('/targets', { params: { tahun: targetYear, bulan_nama: targetMonthName } }),
        api.get('/import-history'),
        api.get('/users?role=sales'),
        api.get('/customers', { params: { area: 'Semua Area' } })
      ]);

      const totalTxVal = txRes.data.total_transactions || 0;
      const historyItems = historyRes.data.data || [];
      const totalFiles = historyItems.length;
      const successFiles = historyItems.filter((h: any) => h.status === 'success').length;
      const failedFiles = historyItems.filter((h: any) => h.status !== 'success').length;
      const totalSalesCount = salesUsersRes.data.data.length || 0;
      const totalCustomersCount = customersRes.data.data.length || 0;

      setKpis([
        {
          id: 1,
          title: 'Total File Import',
          value: `${totalFiles} File`,
          description: 'Jumlah seluruh file yang pernah diimport',
          icon: FileText,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Import Berhasil',
          value: `${successFiles} File`,
          description: 'Jumlah file yang berhasil diproses',
          icon: CheckCircle2,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Import Gagal',
          value: `${failedFiles} File`,
          description: 'Status Gagal',
          icon: XCircle,
          iconColor: 'text-[#ef4444]',
          iconBg: 'bg-[#fee2e2]',
        },
        {
          id: 4,
          title: 'Total Sales',
          value: `${totalSalesCount} Sales`,
          description: 'Total Seluruh Sales',
          icon: User,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 5,
          title: 'Total Customer',
          value: `${totalCustomersCount.toLocaleString('id-ID')} Customer`,
          description: 'Total Seluruh Customer',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 6,
          title: 'Total Transaksi',
          value: `${Number(totalTxVal).toLocaleString('id-ID')} Transaksi`,
          description: 'Total Transaksi Keseluruhan',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

      const myTargets = targetsRes.data.data;
      const totalSales = myTargets.length;
      const inputtedSales = myTargets.filter((t: any) => t.status === 'Sudah Input').length;

      setProgress({
        title: "Input Target Sales",
        current: inputtedSales,
        total: totalSales,
        completedLabel: "Sudah Input:",
        pendingLabel: "Belum Input:",
        unit: "Sales"
      });

      const historyData = historyRes.data.data.map((item: any) => ({
        id: item.id,
        name: item.file_name,
        date: new Date(item.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        rows: Number(item.processed_rows).toLocaleString('id-ID'),
        status: item.status === 'success' ? 'Berhasil' : 'Gagal'
      }));
      setHistoryImports(historyData);

      // Create activities from history
      const activityData = historyRes.data.data.slice(0, 5).map((item: any) => ({
        id: item.id,
        date: new Date(item.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'Import Data',
        description: `Unggah file ${item.file_name} dengan status ${item.status === 'success' ? 'sukses' : 'gagal'}.`,
        status: item.status === 'success' ? 'Berhasil' : 'Gagal',
        role: 'Admin',
        username: 'admin'
      }));
      setRecentActivities(activityData);

      setSalesOptions(['Semua Sales', ...salesUsersRes.data.data.map((u: any) => u.namaSales)]);

    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveModal = async (formData: any) => {
    const parseNum = (val: any) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const clean = String(val).replace(/[^0-9]/g, '');
      return parseInt(clean) || 0;
    };

    try {
      await api.post('/targets', {
        sales: formData.sales,
        decorative: parseNum(formData.decorative),
        automotive: parseNum(formData.automotive),
        industri: parseNum(formData.industri),
        tahun: Number(formData.tahun) || 2026,
        bulan_nama: formData.bulan || 'Juli'
      });
      setIsTargetModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save targets:', err);
    }
  };

  const ActionButtons = (
    <button 
      onClick={() => setIsImportModalOpen(true)}
      className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
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
    <>
      <MainLayout>
        <Topbar title="Dashboard Admin" subtitle="Selamat Datang Admin" actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Progress Card */}
          {progress && (
            <ProgressCard 
              {...progress} 
              onAction={() => setIsTargetModalOpen(true)}
            />
          )}

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
            data={historyImports}
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
            data={recentActivities}
            renderCell={renderActivityCell}
          />
        </div>
      </MainLayout>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => {
          setIsImportModalOpen(false);
          fetchData(); // reload dashboard stats after import
        }} 
      />

      <TargetSalesModal
        isOpen={isTargetModalOpen}
        onClose={() => {
          setIsTargetModalOpen(false);
          fetchData();
        }}
        mode="create"
        data={null}
        onSave={handleSaveModal}
        salesList={salesOptions.filter(s => s !== 'Semua Sales')}
      />
    </>
  );
};
