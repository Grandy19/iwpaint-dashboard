import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, LayoutDashboard, Users, Target, CheckCircle2, XCircle, Filter, Eye, Banknote, Scale, CreditCard, PaintRoller, Wrench, Factory, User, TrendingUp, UserCheck } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ExportModal } from '../../components/ui/ExportModal';

export const SupervisorTargetPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-30');
  const [sales, setSales] = useState('Semua Sales');
  const [appliedSales, setAppliedSales] = useState('Semua Sales');
  
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedSalesData, setSelectedSalesData] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic states
  const [targetsList, setTargetsList] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = async () => {
    if (!user) return;
    try {
      // Load sales list for option dropdown
      const salesRes = await api.get(`/users?role=sales&supervisor_name=${user.name}`);
      const mySales = salesRes.data.data;
      setSalesOptions(['Semua Sales', ...mySales.map((s: any) => s.namaSales)]);

      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Load targets performance summary
      const perfParams: any = { supervisor: user.name, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir };
      if (appliedSales !== 'Semua Sales') perfParams.salesman = appliedSales;
      const perfRes = await api.get('/targets/performance', { params: perfParams });
      setRingkasanTarget(perfRes.data);

      // Load target list
      const targetParams: any = { supervisor: user.name, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir };
      if (appliedSales !== 'Semua Sales') targetParams.salesman = appliedSales;
      const targetRes = await api.get('/targets', { params: targetParams });
      const rows = targetRes.data.data;
      setTargetsList(rows);

      // Set KPIs
      if (appliedSales !== 'Semua Sales') {
        const selectedRow = rows.find((r: any) => r.sales === appliedSales);
        if (selectedRow) {
          setKpiData([
            {
              id: 1,
              title: 'Total Penjualan (Rp)',
              value: selectedRow.totalRealisasi,
              description: `Total realisasi oleh ${appliedSales}`,
              icon: Banknote,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
            },
            {
              id: 2,
              title: 'Total Target',
              value: selectedRow.totalTarget,
              description: `Target bulanan ${appliedSales}`,
              icon: Target,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
            },
            {
              id: 3,
              title: 'Total QTY Penjualan',
              value: `${selectedRow.totalQty || 0} Kg`,
              description: `Total QTY terjual oleh ${appliedSales}`,
              icon: Scale,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
            },
            {
              id: 4,
              title: 'Total Transaksi',
              value: `${selectedRow.totalTransaksi || 0} Transaksi`,
              description: `Total transaksi oleh ${appliedSales}`,
              icon: CreditCard,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
            }
          ]);

          setTargetRealisasi([
            {
              id: 'decorative',
              title: 'Decorative',
              icon: PaintRoller,
              percentage: selectedRow.raw_target_deco > 0 ? Math.min(Math.round((selectedRow.realisasi_deco / selectedRow.raw_target_deco) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_deco / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_deco / 1e6).toFixed(1)} Jt`
            },
            {
              id: 'automotive',
              title: 'Automotive',
              icon: Wrench,
              percentage: selectedRow.raw_target_auto > 0 ? Math.min(Math.round((selectedRow.realisasi_auto / selectedRow.raw_target_auto) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_auto / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_auto / 1e6).toFixed(1)} Jt`
            },
            {
              id: 'industri',
              title: 'Industri',
              icon: Factory,
              percentage: selectedRow.raw_target_ind > 0 ? Math.min(Math.round((selectedRow.realisasi_ind / selectedRow.raw_target_ind) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_ind / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_ind / 1e6).toFixed(1)} Jt`
            }
          ]);
        }
      } else {
        const targetTim = perfRes.data.targetGlobal || 'Rp 0 Jt';
        const realisasiTim = perfRes.data.realisasi || 'Rp 0 Jt';
        const pencapaianTim = perfRes.data.percentage || 0;
        const salesMencapaiTarget = rows.filter((r: any) => r.percentage >= 100).length;

        setKpiData([
          {
            id: 1,
            title: 'Target Penjualan Tim (RP)',
            value: targetTim,
            description: 'Total target penjualan tim Anda',
            icon: Target,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
          },
          {
            id: 2,
            title: 'Realisasi Penjualan Tim (RP)',
            value: realisasiTim,
            description: 'Total realisasi penjualan tim Anda',
            icon: Banknote,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
          },
          {
            id: 3,
            title: 'Pencapaian Target Tim (%)',
            value: `${pencapaianTim}%`,
            description: 'Persentase pencapaian target tim',
            icon: TrendingUp,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
            progress: pencapaianTim > 100 ? 100 : pencapaianTim,
          },
          {
            id: 4,
            title: 'Sales Mencapai Target',
            value: `${salesMencapaiTarget} Sales`,
            description: 'Jumlah sales yang telah mencapai target',
            icon: UserCheck,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
          }
        ]);

        const totalDecoTarget = rows.reduce((acc: number, s: any) => acc + s.raw_target_deco, 0);
        const totalDecoRealisasi = rows.reduce((acc: number, s: any) => acc + s.realisasi_deco, 0);
        const totalAutoTarget = rows.reduce((acc: number, s: any) => acc + s.raw_target_auto, 0);
        const totalAutoRealisasi = rows.reduce((acc: number, s: any) => acc + s.realisasi_auto, 0);
        const totalIndTarget = rows.reduce((acc: number, s: any) => acc + s.raw_target_ind, 0);
        const totalIndRealisasi = rows.reduce((acc: number, s: any) => acc + s.realisasi_ind, 0);

        setTargetRealisasi([
          {
            id: 'decorative',
            title: 'Decorative',
            icon: PaintRoller,
            percentage: totalDecoTarget > 0 ? Math.min(Math.round((totalDecoRealisasi / totalDecoTarget) * 100), 100) : 0,
            realisasi: `Rp ${Number(totalDecoRealisasi / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(totalDecoTarget / 1e6).toFixed(1)} Jt`
          },
          {
            id: 'automotive',
            title: 'Automotive',
            icon: Wrench,
            percentage: totalAutoTarget > 0 ? Math.min(Math.round((totalAutoRealisasi / totalAutoTarget) * 100), 100) : 0,
            realisasi: `Rp ${Number(totalAutoRealisasi / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(totalAutoTarget / 1e6).toFixed(1)} Jt`
          },
          {
            id: 'industri',
            title: 'Industri',
            icon: Factory,
            percentage: totalIndTarget > 0 ? Math.min(Math.round((totalIndRealisasi / totalIndTarget) * 100), 100) : 0,
            realisasi: `Rp ${Number(totalIndRealisasi / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(totalIndTarget / 1e6).toFixed(1)} Jt`
          }
        ]);
      }

      // Load history
      const historyParams: any = { supervisor: user.name };
      if (appliedSales !== 'Semua Sales') historyParams.salesman = appliedSales;
      const historyRes = await api.get('/targets/history', { params: historyParams });
      setHistoryData(historyRes.data.data || []);
    } catch (err) {
      console.error('Failed to load targets performance:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, appliedSales, refreshKey]);

  const handleFilter = () => {
    setAppliedSales(sales);
    setRefreshKey(prev => prev + 1);
  };

  const ActionButtons = (
    <button 
      onClick={() => setIsExportModalOpen(true)}
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const performaColumns = [
    { key: 'sales', label: 'Sales', className: 'w-[18%]' },
    { key: 'totalTarget', label: 'Target', className: 'w-[18%]' },
    { key: 'realisasi', label: 'Realisasi', className: 'w-[20%]' },
    { key: 'percentage', label: 'Pencapaian %', className: 'w-[20%]' },
    { key: 'status', label: 'Status', className: 'w-[15%]' },
    { key: 'detail', label: 'Detail', align: 'center', className: 'w-[9%]' },
  ];

  const renderPerformaCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'sales':
        return <span className="text-gray-700 font-medium">{item.sales}</span>;
      case 'realisasi':
        return item.totalRealisasi;
      case 'status':
        return item.status === 'Sudah Input' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Sudah Input
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Belum Input
          </span>
        );
      case 'percentage': {
        const perc = Number(item.percentage) || 0;
        const colorClass = perc >= 100 ? 'text-[#10b981]' : 'text-blue-600';
        const barColor = perc >= 100 ? 'bg-[#10b981]' : 'bg-blue-600';
        
        return (
          <div className="flex items-center justify-start gap-3 w-full">
            <span className={`font-bold w-[40px] ${colorClass}`}>{perc}%</span>
            <div className="w-[60px] h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                style={{ width: `${Math.min(perc, 100)}%` }}
              />
            </div>
          </div>
        );
      }
      case 'detail':
        return (
          <button 
            onClick={async () => {
              const usersRes = await api.get('/users?role=sales');
              const foundUser = usersRes.data.data.find((u: any) => u.namaSales === item.sales);
              if (foundUser) {
                const modalData = {
                  sales: item.sales,
                  area: foundUser.area,
                  supervisor: foundUser.supervisor,
                  target: item.totalTarget,
                  realisasi: item.totalRealisasi,
                  pencapaian: `${item.percentage}%`,
                  status: item.percentage >= 100 ? 'Tercapai' : 'Belum Tercapai'
                };
                setSelectedSalesData(modalData);
                setShowSalesModal(true);
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer shadow-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap">
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const historyColumns = [
    { key: 'periode', label: 'Periode', className: 'w-[12%]' },
    { key: 'target', label: 'Target', className: 'w-[20%]' },
    { key: 'realisasi', label: 'Realisasi', className: 'w-[20%]' },
    { key: 'pencapaian', label: 'Pencapaian %', className: 'w-[22%]' },
    { key: 'status', label: 'Status', className: 'w-[15%]' },
    { key: 'detail', label: 'Detail', align: 'center', className: 'w-[11%]' },
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
      case 'pencapaian': {
        const perc = Number(item.pencapaian) || 0;
        const colorClass = perc >= 100 ? 'text-[#10b981]' : 'text-blue-600';
        const barColor = perc >= 100 ? 'bg-[#10b981]' : 'bg-blue-600';
        
        return (
          <div className="flex items-center justify-start gap-3 w-full">
            <span className={`font-bold w-[40px] ${colorClass}`}>{perc}%</span>
            <div className="w-[60px] h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                style={{ width: `${Math.min(perc, 100)}%` }}
              />
            </div>
          </div>
        );
      }
      case 'detail':
        return (
          <button 
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer shadow-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap">
            <Eye size={16} /> Detail
          </button>
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
    <>
      <MainLayout sidebarItems={supervisorMenuItems}>
        <Topbar 
          title="Target Sales" 
          subtitle="Pantau pencapaian target penjualan sales Anda pada bulan ini." 
          actionButton={ActionButtons} 
        />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-6 items-end">
            <div className="w-full lg:w-[400px] flex-none">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Periode</label>
              <div className="flex items-center justify-start gap-3 w-full">
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAwal} 
                    onChange={(e) => setPeriodeAwal(e.target.value)} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAkhir} 
                    onChange={(e) => setPeriodeAkhir(e.target.value)} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Modern Divider */}
            <div className="hidden lg:block w-[2px] h-[32px] bg-slate-200 rounded-full mb-[5px]"></div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={(val) => { setSales(val); setAppliedSales(val); }} 
                options={salesOptions} 
                showSearch={true}
              />
            </div>
            
            
          </div>
        </div>

        {/* Top Section: KPIs and Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
            title="Target vs Realisasi Bulan Ini"
          />
        </div>

        {/* Performa Table */}
        <div className="mb-8">
          <DataTable
            title="Tabel Performa Target Sales"
            columns={performaColumns}
            data={targetsList}
            renderCell={renderPerformaCell}
          />
        </div>

        {/* History Table */}
        <div className="mb-8">
          <DataTable
            title="Tabel Riwayat Target"
            columns={historyColumns}
            data={historyData}
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
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName="target-supervisor.pdf"
      />
      </MainLayout>
    </>
  );
};
