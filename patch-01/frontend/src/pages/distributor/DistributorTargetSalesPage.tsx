import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, CheckCircle2, XCircle, Eye, Wallet, Scale, PaintRoller, Wrench, Factory, Target, LayoutDashboard, User, Users } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { AreaTargetModal } from '../../components/ui/AreaTargetModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const DistributorTargetSalesPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [appliedArea, setAppliedArea] = useState('Semua Area');
  const [appliedSupervisor, setAppliedSupervisor] = useState('Semua Supervisor');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  // Dynamic states
  const [targetsList, setTargetsList] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<string[]>(['Semua Area']);
  const [supervisorOptions, setSupervisorOptions] = useState<string[]>(['Semua Supervisor']);

  const loadData = async () => {
    if (!user) return;
    try {
      const myArea = 'Semua Area';
      
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";
      
      const params: any = { area: myArea, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir };
      if (appliedArea !== 'Semua Area') params.area = appliedArea;
      if (appliedSupervisor !== 'Semua Supervisor') params.supervisor = appliedSupervisor;

      // Load targets
      const targetRes = await api.get('/targets', { params });
      const myTargets = targetRes.data.data;

      // Group targets by Area (City)
      const areasGroup: any = {};
      myTargets.forEach((t: any) => {
        const cityName = t.area;
        if (cityName) {
          if (!areasGroup[cityName]) {
            areasGroup[cityName] = {
              area: cityName,
              target_deco: 0,
              realisasi_deco: 0,
              target_auto: 0,
              realisasi_auto: 0,
              target_ind: 0,
              realisasi_ind: 0,
              totalTargetVal: 0,
              totalRealisasiVal: 0,
              totalQtyVal: 0,
              totalTxVal: 0,
              supervisorsSet: new Set(),
            };
          }
          areasGroup[cityName].target_deco += t.raw_target_deco;
          areasGroup[cityName].realisasi_deco += t.realisasi_deco;
          areasGroup[cityName].target_auto += t.raw_target_auto;
          areasGroup[cityName].realisasi_auto += t.realisasi_auto;
          areasGroup[cityName].target_ind += t.raw_target_ind;
          areasGroup[cityName].realisasi_ind += t.realisasi_ind;
          areasGroup[cityName].totalTargetVal += t.raw_target_deco + t.raw_target_auto + t.raw_target_ind;
          areasGroup[cityName].totalRealisasiVal += (t.realisasi_deco + t.realisasi_auto + t.realisasi_ind);
          areasGroup[cityName].totalQtyVal += parseFloat(t.totalQty) || 0;
          areasGroup[cityName].totalTxVal += t.totalTransaksi || 0;
          if (t.supervisor) areasGroup[cityName].supervisorsSet.add(t.supervisor);
        }
      });

      const tableRows = Object.values(areasGroup).map((a: any) => {
        const percentage = a.totalTargetVal > 0 ? Math.round((a.totalRealisasiVal / a.totalTargetVal) * 100) : 0;
        return {
          area: a.area,
          target: a.totalTargetVal >= 1e6 ? `Rp ${(a.totalTargetVal / 1e6).toFixed(1)} Jt` : `Rp ${a.totalTargetVal.toLocaleString('id-ID')}`,
          realisasi: a.totalRealisasiVal >= 1e6 ? `Rp ${(a.totalRealisasiVal / 1e6).toFixed(1)} Jt` : `Rp ${a.totalRealisasiVal.toLocaleString('id-ID')}`,
          qty: `${a.totalQtyVal.toLocaleString('id-ID')} Kg`,
          pencapaian: `${percentage}%`,
          status: percentage >= 100 ? 'Tercapai' : 'Belum Tercapai',
          // Detailed modal metadata
          decorative: `Rp ${(a.target_deco / 1e6).toFixed(1)} Jt`,
          automotive: `Rp ${(a.target_auto / 1e6).toFixed(1)} Jt`,
          industri: `Rp ${(a.target_ind / 1e6).toFixed(1)} Jt`,
          realisasi_deco: `Rp ${(a.realisasi_deco / 1e6).toFixed(1)} Jt`,
          realisasi_auto: `Rp ${(a.realisasi_auto / 1e6).toFixed(1)} Jt`,
          realisasi_ind: `Rp ${(a.realisasi_ind / 1e6).toFixed(1)} Jt`,
          percentageDeco: a.target_deco > 0 ? Math.round((a.realisasi_deco / a.target_deco) * 100) : 0,
          percentageAuto: a.target_auto > 0 ? Math.round((a.realisasi_auto / a.target_auto) * 100) : 0,
          percentageInd: a.target_ind > 0 ? Math.round((a.realisasi_ind / a.target_ind) * 100) : 0,
        };
      });
      setTargetsList(tableRows);

      // Populate filter area options
      const uniqueCities = Object.keys(areasGroup);
      setAreaOptions(['Semua Area', ...uniqueCities]);

      const allSupervisors = Array.from(new Set(myTargets.map((t: any) => t.supervisor).filter(Boolean))) as string[];
      setSupervisorOptions(['Semua Supervisor', ...allSupervisors]);

      // KPIs
      const perfRes = await api.get('/targets/performance', { params });
      setRingkasanTarget(perfRes.data);

      const totalTargetVal = myTargets.reduce((acc: number, t: any) => acc + t.raw_target_deco + t.raw_target_auto + t.raw_target_ind, 0);
      const totalRealisasiVal = myTargets.reduce((acc: number, t: any) => acc + (t.realisasi_deco + t.realisasi_auto + t.realisasi_ind), 0);
      const globalPercentage = totalTargetVal > 0 ? Math.round((totalRealisasiVal / totalTargetVal) * 100) : 0;
      
      const achievedAreas = Object.values(areasGroup).filter((a: any) => {
        const p = a.totalTargetVal > 0 ? Math.round((a.totalRealisasiVal / a.totalTargetVal) * 100) : 0;
        return p >= 100;
      }).length;

      setKpis([
        {
          id: 1,
          title: 'Target Penjualan Area',
          value: totalTargetVal >= 1e6 ? `Rp ${(totalTargetVal / 1e6).toFixed(1)} Jt` : `Rp ${totalTargetVal.toLocaleString('id-ID')}`,
          description: 'Total Target Penjualan Area',
          icon: Target,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 2,
          title: 'Realisasi Penjualan Area',
          value: totalRealisasiVal >= 1e6 ? `Rp ${(totalRealisasiVal / 1e6).toFixed(1)} Jt` : `Rp ${totalRealisasiVal.toLocaleString('id-ID')}`,
          description: 'Total Realisasi Penjualan Area',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Pencapaian Target Area',
          value: `${globalPercentage}%`,
          description: 'Persentase Pencapaian Area',
          icon: Target,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
          progress: globalPercentage > 100 ? 100 : globalPercentage
        },
        {
          id: 4,
          title: 'Area Mencapai Target',
          value: `${achievedAreas} Area`,
          description: 'Jumlah Area yang Mencapai Target',
          icon: CheckCircle2,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

      // Aggregate target vs realisasi breakdown
      const totalDecoTarget = myTargets.reduce((acc: number, t: any) => acc + t.raw_target_deco, 0);
      const totalDecoRealisasi = myTargets.reduce((acc: number, t: any) => acc + t.realisasi_deco, 0);
      const totalAutoTarget = myTargets.reduce((acc: number, t: any) => acc + t.raw_target_auto, 0);
      const totalAutoRealisasi = myTargets.reduce((acc: number, t: any) => acc + t.realisasi_auto, 0);
      const totalIndTarget = myTargets.reduce((acc: number, t: any) => acc + t.raw_target_ind, 0);
      const totalIndRealisasi = myTargets.reduce((acc: number, t: any) => acc + t.realisasi_ind, 0);

      setTargetRealisasi([
        {
          id: 'decorative',
          title: 'Decorative',
          icon: PaintRoller,
          percentage: totalDecoTarget > 0 ? Math.round((totalDecoRealisasi / totalDecoTarget) * 100) : 0,
          realisasi: `Rp ${Number(totalDecoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalDecoTarget / 1e6).toFixed(1)} Jt`
        },
        {
          id: 'automotive',
          title: 'Automotive',
          icon: Wrench,
          percentage: totalAutoTarget > 0 ? Math.round((totalAutoRealisasi / totalAutoTarget) * 100) : 0,
          realisasi: `Rp ${Number(totalAutoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalAutoTarget / 1e6).toFixed(1)} Jt`
        },
        {
          id: 'industri',
          title: 'Industri',
          icon: Factory,
          percentage: totalIndTarget > 0 ? Math.round((totalIndRealisasi / totalIndTarget) * 100) : 0,
          realisasi: `Rp ${Number(totalIndRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalIndTarget / 1e6).toFixed(1)} Jt`
        }
      ]);

      // Load History Data
      const historyParams: any = { area: 'Semua Area' };
      if (appliedArea !== 'Semua Area') historyParams.area = appliedArea;
      if (appliedSupervisor !== 'Semua Supervisor') historyParams.supervisor = appliedSupervisor;

      const historyRes = await api.get('/targets/history', { params: historyParams });
      const historyTable = historyRes.data.data.map((h: any) => ({
        periode: h.periode,
        target: h.target >= 1e6 ? `Rp ${(h.target / 1e6).toFixed(1)} Jt` : `Rp ${h.target.toLocaleString('id-ID')}`,
        realisasi: h.realisasi >= 1e6 ? `Rp ${(h.realisasi / 1e6).toFixed(1)} Jt` : `Rp ${h.realisasi.toLocaleString('id-ID')}`,
        pencapaian: `${h.percentage}%`,
        status: h.percentage >= 100 ? 'Tercapai' : 'Belum Tercapai'
      }));
      setHistoryData(historyTable);

    } catch (err) {
      console.error('Failed to load regional target metrics:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, appliedArea, appliedSupervisor, refreshKey]);

  const handleFilter = () => {
    setAppliedArea(area);
    setAppliedSupervisor(supervisor);
    setRefreshKey(prev => prev + 1);
  };

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
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const distributorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
    { name: 'Supervisor', icon: User, path: '/distributor-dashboard/supervisor' },
    { name: 'Sales', icon: Users, path: '/distributor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/distributor-dashboard/target-sales' },
  ];

  const filteredTargets = targetsList.filter((t: any) => {
    if (area !== 'Semua Area' && t.area !== area) return false;
    return true;
  });

  return (
    <MainLayout sidebarItems={distributorMenuItems}>
      <Topbar title="Target Penjualan" subtitle="Pantau pencapaian target penjualan seluruh area distribusi." actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAwal} 
                    onChange={(e) => setPeriodeAwal(e.target.value)} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAkhir} 
                    onChange={(e) => setPeriodeAkhir(e.target.value)} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={areaOptions} 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={supervisorOptions} 
                showSearch={true}
              />
            </div>
            
            <div className="md:col-span-1">
              <button 
                onClick={handleFilter}
                className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px] cursor-pointer"
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
              {kpis.map((kpi) => (
                <KpiCard key={kpi.id} {...kpi} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 h-full">
            <RingkasanTargetCard {...ringkasanTarget} />
          </div>
        </div>

        {/* Target vs Realisasi Full Width */}
        <div className="mb-8">
          <TargetRealisasiCard 
            data={targetRealisasi} 
            title="Target vs Realisasi Wilayah" 
          />
        </div>

        {/* Area Target Performance Table */}
        <div className="mb-8">
          <DataTable
            title="Tabel Performa Target Per-Area"
            columns={areaColumns}
            data={filteredTargets}
            renderCell={renderCell}
          />
        </div>

        {/* Riwayat Target */}
        <div className="mb-8">
          <DataTable
            title="Riwayat Target"
            columns={historyColumns}
            data={historyData}
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
