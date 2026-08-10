import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { CheckCircle2, XCircle, Eye, Download, Wallet, CreditCard, Scale, Target, FileText, Users, User, Upload } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { ProgressCard } from '../../components/common/ProgressCard';
import { ImportModal } from '../../components/ui/ImportModal';
import { TargetSalesModal } from '../../components/ui/TargetSalesModal';
import { ExportModal } from '../../components/ui/ExportModal';
import api from '../../utils/api';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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

      const [salesRes, targetsRes, historyRes, salesUsersRes, customersRes] = await Promise.all([
        api.get('/dashboard/total-sales').catch(() => ({ data: { total_sales: 0 } })),
        api.get('/targets', { params: { tahun: targetYear, bulan_nama: targetMonthName } }).catch(() => ({ data: { data: [] } })),
        api.get('/import-history').catch(() => ({ data: { data: [] } })),
        api.get('/users?role=sales').catch(() => ({ data: { data: [] } })),
        api.get('/customers', { params: { area: 'Semua Area' } }).catch(() => ({ data: { data: [] } }))
      ]);

      const totalSalesRp = salesRes.data?.total_sales || 0;
      const historyItems = historyRes.data?.data || [];
      const totalFiles = historyItems.length;
      const successFiles = historyItems.filter((h: any) => h.status === 'success').length;
      const failedFiles = historyItems.filter((h: any) => h.status !== 'success').length;
      const totalSalesCount = salesUsersRes.data?.data?.length || 0;
      const totalCustomersCount = customersRes.data?.data?.length || 0;

      const formatCurrency = (val: number) => {
        if (val >= 1000000000) {
          return `Rp ${(val / 1000000000).toFixed(1).replace('.', ',')} M`;
        }
        if (val >= 1000000) {
          return `Rp ${(val / 1000000).toFixed(1).replace('.', ',')} Jt`;
        }
        return `Rp ${val.toLocaleString('id-ID')}`;
      };

      setKpis([
        {
          id: 1,
          title: 'Total File Diimpor',
          value: `${totalFiles} File`,
          description: 'Total Berkas Masuk',
          icon: FileText,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'File Berhasil',
          value: `${successFiles} File`,
          description: 'Status Berhasil',
          icon: CheckCircle2,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'File Gagal',
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
          title: 'Total Penjualan (Rp)',
          value: formatCurrency(Number(totalSalesRp)),
          description: 'Total Penjualan Keseluruhan',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

      const myTargets = targetsRes.data?.data || [];
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

      const historyData = historyItems.map((item: any) => ({
        id: item.id,
        name: item.file_name,
        date: new Date(item.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        rows: Number(item.processed_rows).toLocaleString('id-ID'),
        status: item.status === 'success' ? 'Berhasil' : 'Gagal'
      }));
      setHistoryImports(historyData);

      // Create activities from history
      const activityData = historyItems.slice(0, 5).map((item: any) => ({
        id: item.id,
        date: new Date(item.uploaded_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        type: 'Import Data',
        description: `Unggah file ${item.file_name} dengan status ${item.status === 'success' ? 'sukses' : 'gagal'}.`,
        status: item.status === 'success' ? 'Berhasil' : 'Gagal',
        role: 'Admin',
        username: 'admin'
      }));
      setRecentActivities(activityData);

      if (salesUsersRes.data?.data) {
        setSalesOptions(['Semua Sales', ...salesUsersRes.data.data.map((u: any) => u.namaSales || u.name || u.username)]);
      }

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
    <div className="flex gap-4">
      <button 
        onClick={() => setIsExportModalOpen(true)}
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => setIsImportModalOpen(true)}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Download size={18} />
        Import Data
      </button>
    </div>
  );

  const renderHistoryCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="text-gray-800 font-semibold truncate block" title={item.name}>{item.name}</span>;
      case 'date':
        return <span className="text-gray-600 whitespace-nowrap">{item.date}</span>;
      case 'rows':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.rows} Data</span>;
      case 'status':
        return item.status === 'Berhasil' || item.status === 'success' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium whitespace-nowrap">
            <CheckCircle2 size={16} /> Berhasil
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium whitespace-nowrap">
            <XCircle size={16} /> Gagal
          </span>
        );
      case 'detail':
        return (
          <button 
            onClick={() => navigate('/import')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors cursor-pointer whitespace-nowrap"
          >
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
        return <span className="text-gray-600 whitespace-nowrap">{item.date}</span>;
      case 'type':
        return <span className="text-gray-800 font-semibold whitespace-nowrap">{item.type}</span>;
      case 'description':
        return <span className="text-gray-600 truncate block" title={item.description}>{item.description}</span>;
      case 'status':
        return item.status === 'Berhasil' || item.status === 'success' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium whitespace-nowrap">
            <CheckCircle2 size={16} /> Berhasil
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium whitespace-nowrap">
            <XCircle size={16} /> Gagal
          </span>
        );
      case 'role':
        return <span className="text-gray-600 whitespace-nowrap">{item.role}</span>;
      case 'username':
        return <span className="text-gray-600 whitespace-nowrap">{item.username}</span>;
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
              { key: 'name', label: 'Nama File', className: 'w-[30%]' },
              { key: 'date', label: 'Tanggal Import', className: 'w-[26%]' },
              { key: 'rows', label: 'Jumlah Data', className: 'w-[17%]' },
              { key: 'status', label: 'Status', className: 'w-[17%]' },
              { key: 'detail', label: 'Detail', className: 'w-[10%]' },
            ]}
            data={historyImports}
            renderCell={renderHistoryCell}
          />

          {/* Activity Table */}
          <DataTable
            title="Aktivitas Terbaru"
            columns={[
              { key: 'date', label: 'Tanggal', className: 'w-[16%]' },
              { key: 'type', label: 'Jenis Aktivitas', className: 'w-[16%]' },
              { key: 'description', label: 'Keterangan', className: 'w-[32%]' },
              { key: 'status', label: 'Status', className: 'w-[14%]' },
              { key: 'role', label: 'Role', className: 'w-[12%]' },
              { key: 'username', label: 'Username', className: 'w-[10%]' },
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
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName="dashboard-admin.pdf"
      />
    </>
  );
};
