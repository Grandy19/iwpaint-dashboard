import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, Wallet, Package, Banknote, PaintRoller, Wrench, Factory } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ChartCard } from '../../components/ui/ChartCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const SalesDashboardPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Bulan');

  const [kpiData, setKpiData] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  const isAll = kategoriProduk === 'Semua Kategori';

  const ringkasanTargetTitle = isAll ? "Ringkasan Keseluruhan Target" : `Ringkasan Target ${kategoriProduk}`;
  const targetRealisasiTitle = isAll ? "Target vs Realisasi Bulan Ini" : `Target vs Realisasi ${kategoriProduk} Bulan Ini`;
  const topProductsTitle = isAll ? "Top 10 Produk Terlaris Penjualan Customer" : `Top 10 Produk Terlaris Penjualan Customer Kategori ${kategoriProduk}`;
  const chartCardTitle = isAll ? "Tren Pembelian Customer" : `Tren Pembelian Customer Kategori ${kategoriProduk}`;

  const loadData = async () => {
    if (!user) return;
    try {
      const salesmanName = user.name;
      const params: any = { 
        salesman: salesmanName,
        periodeAwal,
        periodeAkhir
      };
      if (kategoriProduk !== 'Semua Kategori') {
        params.kategori = kategoriProduk;
      }

      // Fetch KPIs
      const kpisRes = await api.get('/sales/kpis', { params });
      const kpis = kpisRes.data;

      setKpiData([
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: kpis.total_sales >= 1e9 ? `Rp ${(kpis.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpis.total_sales / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan keseluruhan',
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Qty Penjualan',
          value: `${Number(kpis.total_weight).toLocaleString('id-ID')} Kg`,
          description: 'Total qty penjualan untuk customer terpilih',
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Transaksi',
          value: `${kpis.total_transactions} Transaksi`,
          description: 'Total transaksi periode terpilih',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 4,
          title: 'Customer yang Dilayani',
          value: `${kpis.total_customers} Customer`,
          description: 'Customer yang Dialayani',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Fetch targets performance summary
      const targetPerfRes = await api.get('/targets/performance', { params: { salesman: salesmanName, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      setRingkasanTarget(targetPerfRes.data);

      // Fetch targets vs realisasi breakdown
      const targetRes = await api.get('/targets', { params: { salesman: salesmanName, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
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

      // Fetch Trend moved to separate useEffect
    } catch (err) {
      console.error('Failed to load sales dashboard:', err);
    }
  };

  const loadTrendData = async () => {
    if (!user) return;
    try {
      const salesmanName = user.name;
      const params: any = { 
        salesman: salesmanName,
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
    loadData();
  }, [user]);

  useEffect(() => {
    loadTrendData();
  }, [user, chartPeriode, chartJenisData]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const salesMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/sales-dashboard' },
    { name: 'Customer', icon: Users, path: '/sales-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/sales-dashboard/target' },
  ];

  return (
    <MainLayout sidebarItems={salesMenuItems}>
      <Topbar title="Dashboard Sales" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

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
                showSearch={true}
              />
            </div>
            
            <div className="col-span-1">
              <button 
                onClick={loadData}
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
            {kpiData.map((kpi) => (
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
        <ChartCard 
          data={trendData} 
          title={chartCardTitle}
          jenisData={chartJenisData}
          setJenisData={setChartJenisData}
          periode={chartPeriode}
          setPeriode={setChartPeriode}
          filterAktifLabel="1 Juni 2026 - 30 Juni 2026"
        />

        {/* Top 10 Produk */}
        <TopProductsCard data={topProducts} title={topProductsTitle} />

      </div>
    </MainLayout>
  );
};

