import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye, Briefcase, UserCheck, Wallet, Scale, CreditCard, PaintRoller, Wrench, Factory } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ChartCard } from '../../components/ui/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import clsx from 'clsx';

export const DistributorDashboardPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Bulan');

  // Dynamic states
  const [kpis, setKpis] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [supervisorsTableData, setSupervisorsTableData] = useState<any[]>([]);

  const isAllKategori = kategoriProduk === 'Semua Kategori';
  const ringkasanTargetTitle = "Ringkasan Target Area";
  const targetRealisasiTitle = isAllKategori ? "Target vs Realisasi Area Bulan Ini" : `Target vs Realisasi ${kategoriProduk}`;

  const loadData = async () => {
    if (!user) return;
    try {
      const myArea = 'Semua Area';
      const params: any = { 
        area: myArea,
        periodeAwal,
        periodeAkhir
      };
      if (kategoriProduk !== 'Semua Kategori') {
        params.kategori = kategoriProduk;
      }

      // Load KPIs
      const kpisRes = await api.get('/sales/kpis', { params });
      const kpisVal = kpisRes.data;

      // Load count of supervisors and active sales in this area
      const supervisorsRes = await api.get(`/users?role=supervisor`);
      const allSupervisors = supervisorsRes.data.data;
      const areaSupervisors = myArea === 'Semua Area' ? allSupervisors : allSupervisors.filter((s: any) => s.area === myArea);

      // Remove setKpis from here, it will be moved after targetPerfRes

      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Load targets performance summary
      const targetPerfRes = await api.get('/targets/performance', { params: { area: myArea, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      setRingkasanTarget(targetPerfRes.data);

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan Tim',
          value: kpisVal.total_sales >= 1e9 ? `Rp ${(kpisVal.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpisVal.total_sales / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan wilayah Anda',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Qty Penjualan',
          value: `${Number(kpisVal.total_weight).toLocaleString('id-ID')} Kg`,
          description: 'Berat total produk terjual wilayah Anda',
          icon: Scale,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Total Supervisor',
          value: `${areaSupervisors.length} Supervisor`,
          description: 'Supervisor di wilayah Anda',
          icon: UserCheck,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        },
        {
          id: 4,
          title: 'Pencapaian Target Area',
          value: `${targetPerfRes.data.percentage || 0}%`,
          description: 'Persentase pencapaian target area',
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
          progress: targetPerfRes.data.percentage > 100 ? 100 : (targetPerfRes.data.percentage || 0),
        }
      ]);

      // Load target list for supervisors in this area
      const targetsRes = await api.get('/targets', { params: { area: myArea, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      const myTargets = targetsRes.data.data;

      // Group targets by supervisor
      const supervisorsGroup: any = {};
      areaSupervisors.forEach((sup: any) => {
        supervisorsGroup[sup.namaSupervisor] = {
          id: sup.id,
          supervisor: sup.namaSupervisor,
          area: sup.area,
          target_deco: 0,
          realisasi_deco: 0,
          target_auto: 0,
          realisasi_auto: 0,
          target_ind: 0,
          realisasi_ind: 0,
          totalTargetVal: 0,
          totalRealisasiVal: 0,
          totalQtyVal: 0,
        };
      });

      myTargets.forEach((t: any) => {
        // Find which supervisor this sales belongs to
        const sName = t.supervisor;
        if (sName && supervisorsGroup[sName]) {
          supervisorsGroup[sName].target_deco += t.raw_target_deco;
          supervisorsGroup[sName].realisasi_deco += t.realisasi_deco;
          supervisorsGroup[sName].target_auto += t.raw_target_auto;
          supervisorsGroup[sName].realisasi_auto += t.realisasi_auto;
          supervisorsGroup[sName].target_ind += t.raw_target_ind;
          supervisorsGroup[sName].realisasi_ind += t.realisasi_ind;
          supervisorsGroup[sName].totalTargetVal += t.raw_target_deco + t.raw_target_auto + t.raw_target_ind;
          supervisorsGroup[sName].totalRealisasiVal += (t.realisasi_deco + t.realisasi_auto + t.realisasi_ind);
          supervisorsGroup[sName].totalQtyVal += parseFloat(t.totalQty) || 0;
        }
      });

      const tableRows = Object.values(supervisorsGroup).map((s: any) => {
        const totalTarget = s.totalTargetVal;
        const totalRealisasi = s.totalRealisasiVal;
        const percentage = totalTarget > 0 ? Math.round((totalRealisasi / totalTarget) * 100) : 0;
        return {
          id: s.id,
          supervisor: s.supervisor,
          area: s.area,
          target: totalTarget >= 1e6 ? `Rp ${(totalTarget / 1e6).toFixed(1)} Jt` : `Rp ${totalTarget.toLocaleString('id-ID')}`,
          realisasi: totalRealisasi >= 1e6 ? `Rp ${(totalRealisasi / 1e6).toFixed(1)} Jt` : `Rp ${totalRealisasi.toLocaleString('id-ID')}`,
          qty: `${s.totalQtyVal.toLocaleString('id-ID')} Kg`,
          pencapaian: `${percentage}%`,
          raw_percentage: percentage
        };
      });
      setSupervisorsTableData(tableRows);

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

      // Fetch Top Products
      const topProductsRes = await api.get('/sales/top-products', { params });
      const products = topProductsRes.data.data;
      const maxVal = products.length > 0 ? Math.max(...products.map((p: any) => p.total_sales)) : 1;
      setTopProducts(products.map((p: any, idx: number) => ({
        id: idx + 1,
        name: p.nama_produk,
        value: p.total_sales,
        max: maxVal,
        label: p.total_sales >= 1e6 ? `Rp ${(p.total_sales / 1e6).toFixed(1)} Jt` : `Rp ${Number(p.total_sales).toLocaleString('id-ID')}`
      })));

      // Trend data is now handled by loadTrendData directly so it can respond to chart filter changes
    } catch (err) {
      console.error('Failed to load distributor dashboard:', err);
    }
  };

  const loadTrendData = async () => {
    if (!user) return;
    try {
      const params: any = { 
        area: 'Semua Area',
        periodeAwal,
        periodeAkhir,
        periode: chartPeriode,
        jenisData: chartJenisData
      };
      if (kategoriProduk !== 'Semua Kategori') {
        params.kategori = kategoriProduk;
      }

      const trendRes = await api.get('/sales/trend', { params });
      const trend = trendRes.data;
      setTrendData(trend.labels.map((lbl: string, idx: number) => ({
        date: chartPeriode === 'Bulan' ? lbl.slice(0, 3) : lbl,
        value: trend.values[idx]
      })));
    } catch (err) {
      console.error('Failed to load trend data:', err);
    }
  };

  useEffect(() => {
    loadTrendData();
  }, [user, chartPeriode, chartJenisData]);

  useEffect(() => {
    loadData();
  }, [user]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const distributorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
    { name: 'Supervisor', icon: User, path: '/distributor-dashboard/supervisor' },
    { name: 'Sales', icon: Briefcase, path: '/distributor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/distributor-dashboard/target-sales' },
  ];

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
        return (
          <span className={clsx(
            "font-semibold",
            item.raw_percentage >= 100 ? "text-[#10b981]" : "text-amber-500"
          )}>
            {item.pencapaian}
          </span>
        );
      case 'detail':
        return (
          <button 
            onClick={async () => {
              const res = await api.get(`/users?role=supervisor&name=${item.supervisor}`);
              if (res.data.data.length > 0) {
                setSelectedSupervisor(res.data.data[0]);
                setIsModalOpen(true);
              }
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

  return (
    <MainLayout sidebarItems={distributorMenuItems}>
      <Topbar title="Dashboard Kepala Distributor" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="col-span-2">
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
            
            <div className="col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Kategori Produk</label>
              <CustomSelect 
                value={kategoriProduk} 
                onChange={setKategoriProduk} 
                options={['Semua Kategori', 'Decorative', 'Automotive', 'Industri']} 
              />
            </div>
            
            <div className="col-span-1">
              <button 
                onClick={() => {
                  loadData();
                  loadTrendData();
                }}
                className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px] cursor-pointer"
              >
                <Filter size={18} />
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {/* KPI and Ringkasan Target Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <RingkasanTargetCard {...ringkasanTarget} title={ringkasanTargetTitle} />
          </div>
        </div>

        {/* Target Realisasi Section */}
        <div className="mb-8">
          <TargetRealisasiCard data={targetRealisasi} title={targetRealisasiTitle} />
        </div>

        {/* Chart Area */}
        <div className="mb-8">
          <ChartCard 
            data={trendData} 
            title="Tren Pembelian Area"
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
            filterAktifLabel={`${periodeAwal} - ${periodeAkhir}`}
          />
        </div>

        {/* Table Performance */}
        <DataTable
          title="Performa Target Per-Supervisor"
          columns={tableColumns}
          data={supervisorsTableData}
          renderCell={renderTableCell}
        />

        {/* Top 10 Produk */}
        <TopProductsCard data={topProducts} title="Top 10 Produk Terlaris Wilayah Anda" />

      </div>

      <SupervisorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="detail"
        data={selectedSupervisor}
      />
    </MainLayout>
  );
};
