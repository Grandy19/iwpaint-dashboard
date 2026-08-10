import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, LayoutDashboard, Users, Target, CheckCircle2, XCircle, Wallet, Scale, PaintRoller, Wrench, Factory, TrendingUp, Flag } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { DataTable } from '../../components/common/DataTable';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ExportModal } from '../../components/ui/ExportModal';

export const SalesTargetPage = () => {
  const { user } = useAuth();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const loadData = async () => {
    if (!user) return;
    try {
      const salesmanName = user.name;
      const now = new Date();
      const targetYear = now.getFullYear();
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[now.getMonth()];
      const params = { salesman: salesmanName, tahun: targetYear, bulan_nama: targetMonthName };

      // Load performance summary
      const perfRes = await api.get('/targets/performance', { params });
      const perfData = perfRes.data;
      setRingkasanTarget(perfData);

      // Generate KPIs based on perfData safely
      const rawTarget = perfData.raw_target || 0;
      const rawRealisasi = perfData.raw_realisasi || 0;
      const percentage = rawTarget > 0 ? Math.min(Math.round((rawRealisasi / rawTarget) * 100), 100) : 0;
      const sisa = rawTarget - rawRealisasi;
      const finalSisa = sisa > 0 ? sisa : 0;

      const formatCurrency = (val: number) => {
        if (!val || val === 0) return '0';
        if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} M`;
        if (val >= 1e6) return `Rp ${(val / 1e6).toFixed(0)} Jt`;
        return `Rp ${val.toLocaleString('id-ID')}`;
      };

      setKpiData([
        {
          id: 1,
          title: 'Target Penjualan',
          value: formatCurrency(rawTarget),
          description: `Target penjualan bulan ${targetMonthName} ${targetYear}`,
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Realisasi Penjualan',
          value: formatCurrency(rawRealisasi),
          description: 'Total penjualan periode aktif',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Pencapaian Target',
          value: `${percentage}%`,
          description: `Persentase terhadap target bulan ${targetMonthName} ${targetYear}`,
          icon: TrendingUp,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
          progress: percentage > 100 ? 100 : percentage,
        },
        {
          id: 4,
          title: 'Sisa Target',
          value: formatCurrency(finalSisa),
          description: 'Nilai penjualan yang masih harus dicapai',
          icon: Flag,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

      // Load target rows
      const targetRes = await api.get('/targets', { params });
      const myTargets = targetRes.data.data[0];

      if (myTargets) {
        setTargetRealisasi([
          {
            id: 'decorative',
            title: 'Decorative',
            icon: PaintRoller,
            percentage: myTargets.raw_target_deco > 0 ? Math.min(Math.round((myTargets.realisasi_deco / myTargets.raw_target_deco) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_deco / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_deco / 1e6).toFixed(1)} Jt`
          },
          {
            id: 'automotive',
            title: 'Automotive',
            icon: Wrench,
            percentage: myTargets.raw_target_auto > 0 ? Math.min(Math.round((myTargets.realisasi_auto / myTargets.raw_target_auto) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_auto / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_auto / 1e6).toFixed(1)} Jt`
          },
          {
            id: 'industri',
            title: 'Industri',
            icon: Factory,
            percentage: myTargets.raw_target_ind > 0 ? Math.min(Math.round((myTargets.realisasi_ind / myTargets.raw_target_ind) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_ind / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_ind / 1e6).toFixed(1)} Jt`
          }
        ]);
      } else {
        setTargetRealisasi([]);
      }

      // Generate dynamic target history
      const historyRes = await api.get('/targets/history', { params: { salesman: salesmanName } });
      setHistoryData(historyRes.data.data);
    } catch (err) {
      console.error('Failed to load targets:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const ActionButtons = (
    <button 
      onClick={() => setIsExportModalOpen(true)}
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const formatShortCurrency = (val: any) => {
    if (val === null || val === undefined || val === '') return 'Rp 0';
    if (typeof val === 'string') {
      return val.replace('.', ',');
    }
    const num = Number(val) || 0;
    if (num >= 1e9) {
      return `Rp ${(num / 1e9).toFixed(1).replace(/\.0$/, '').replace('.', ',')} M`;
    }
    if (num >= 1e6) {
      return `Rp ${(num / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Jt`;
    }
    if (num >= 1e3) {
      return `Rp ${(num / 1e3).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Rb`;
    }
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const historyColumns = [
    { key: 'periode', label: 'Periode', className: 'w-[22%]' },
    { key: 'target', label: 'Target', className: 'w-[20%]' },
    { key: 'realisasi', label: 'Realisasi', className: 'w-[20%]' },
    { key: 'pencapaian', label: 'Pencapaian', className: 'w-[18%]' },
    { key: 'status', label: 'Status', className: 'w-[20%]' },
  ];

  const renderHistoryCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'periode':
        return <span className="text-gray-800 font-semibold truncate block" title={item.periode}>{item.periode}</span>;
      case 'target':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{formatShortCurrency(item.target)}</span>;
      case 'realisasi':
        return <span className="text-gray-800 font-semibold whitespace-nowrap">{formatShortCurrency(item.realisasi)}</span>;
      case 'pencapaian': {
        const pctNum = parseFloat(item.pencapaian) || 0;
        const isReached = pctNum >= 100 || item.status === 'Tercapai';
        return (
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm min-w-[42px] ${isReached ? 'text-emerald-600' : 'text-blue-600'}`}>
              {item.pencapaian}
            </span>
            <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${isReached ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(pctNum, 100)}%` }}
              />
            </div>
          </div>
        );
      }
      case 'status':
        return item.status === 'Tercapai' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium whitespace-nowrap">
            <CheckCircle2 size={16} /> Tercapai
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium whitespace-nowrap">
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
    <>
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
              {kpiData.map((kpi) => (
                <KpiCard key={kpi.id} {...kpi} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <RingkasanTargetCard {...ringkasanTarget} />
          </div>
        </div>

        {/* Target vs Realisasi Full Width */}
        <div className="mb-8">
          <TargetRealisasiCard 
            data={targetRealisasi} 
            title="Target vs Realisasi" 
          />
        </div>

        {/* History Table */}
        <DataTable
          title="Tabel Riwayat Target"
          columns={historyColumns}
          data={historyData}
          renderCell={renderHistoryCell}
        />

      </div>
      </MainLayout>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName="target-sales.pdf"
      />
    </>
  );
};
