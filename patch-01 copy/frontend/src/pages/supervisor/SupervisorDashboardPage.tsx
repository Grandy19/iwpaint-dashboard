import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye, Wallet, Scale, CreditCard, PaintRoller, Wrench, Factory, Banknote, Package, Flag } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { RingkasanTargetCard } from '../../components/ui/RingkasanTargetCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ChartCard } from '../../components/ui/ChartCard';
import { DataTable } from '../../components/common/DataTable';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import clsx from 'clsx';

export const SupervisorDashboardPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [kategoriProduk, setKategoriProduk] = useState('Semua Kategori');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Bulan');

  const [kpis, setKpis] = useState<any[]>([]);
  const [ringkasanTarget, setRingkasanTarget] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [targetRealisasi, setTargetRealisasi] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [salesTableData, setSalesTableData] = useState<any[]>([]);

  const isAllKategori = kategoriProduk === 'Semua Kategori';

  const ringkasanTargetTitle = isAllKategori ? "Ringkasan Keseluruhan Target" : `Ringkasan Target ${kategoriProduk}`;
  const targetRealisasiTitle = isAllKategori ? "Target vs Realisasi Bulan Ini" : `Target vs Realisasi ${kategoriProduk} Bulan Ini`;
  const chartCardTitle = isAllKategori ? "Tren Penjualan Tim" : `Tren Penjualan Tim Kategori ${kategoriProduk}`;

  const loadTrendData = async () => {
    if (!user) return;
    try {
      const supervisorName = user.name;
      const params: any = { 
        supervisor: supervisorName,
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

  const loadData = async () => {
    if (!user) return;
    try {
      const supervisorName = user.name;
      const params: any = { 
        supervisor: supervisorName,
        periodeAwal,
        periodeAkhir
      };
      if (kategoriProduk !== 'Semua Kategori') {
        params.kategori = kategoriProduk;
      }

      // Load KPIs base numbers
      const kpisRes = await api.get('/sales/kpis', { params });
      const kpisVal = kpisRes.data;

      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Load targets performance summary
      const targetPerfRes = await api.get('/targets/performance', { params: { supervisor: supervisorName, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      const ringkasanData = targetPerfRes.data;
      setRingkasanTarget(ringkasanData);

      // Load targets list (which gives individual sales target vs realisasi)
      const targetRes = await api.get('/targets', { params: { supervisor: supervisorName, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      const salesRows = targetRes.data.data;
      setSalesTableData(salesRows);

      // Map KPIs
      setKpis([
        {
          id: 1,
          title: 'Total Penjualan Tim',
          value: kpisVal.total_sales >= 1e9 ? `Rp ${(kpisVal.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpisVal.total_sales / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan seluruh tim pada periode aktif',
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Qty Penjualan',
          value: `${Number(kpisVal.total_weight).toLocaleString('id-ID')} Kg`,
          description: 'Total kuantitas produk yang berhasil dijual',
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Sales',
          value: `${salesRows.length} Sales`,
          description: 'Jumlah sales yang berada di bawah supervisor',
          icon: User,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 4,
          title: 'Pencapaian Target Tim',
          value: `${ringkasanData.percentage}%`,
          description: 'Persentase pencapaian target seluruh tim',
          icon: Flag,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
          progress: ringkasanData.percentage > 100 ? 100 : ringkasanData.percentage,
        }
      ]);

      // Aggregate target vs realisasi breakdown
      const totalDecoTarget = salesRows.reduce((acc: number, s: any) => acc + s.raw_target_deco, 0);
      const totalDecoRealisasi = salesRows.reduce((acc: number, s: any) => acc + s.realisasi_deco, 0);
      const totalAutoTarget = salesRows.reduce((acc: number, s: any) => acc + s.raw_target_auto, 0);
      const totalAutoRealisasi = salesRows.reduce((acc: number, s: any) => acc + s.realisasi_auto, 0);
      const totalIndTarget = salesRows.reduce((acc: number, s: any) => acc + s.raw_target_ind, 0);
      const totalIndRealisasi = salesRows.reduce((acc: number, s: any) => acc + s.realisasi_ind, 0);

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

    } catch (err) {
      console.error('Failed to load supervisor dashboard:', err);
    }
  };

  useEffect(() => {
    loadData();
    loadTrendData();
  }, [user]);

  useEffect(() => {
    loadTrendData();
  }, [chartPeriode, chartJenisData]);

  const ActionButtons = (
    <button 
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const supervisorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor-dashboard' },
    { name: 'Sales', icon: User, path: '/supervisor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/supervisor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/supervisor-dashboard/target-sales' },
  ];

  const tableColumns = [
    { key: 'sales', label: 'Sales' },
    { key: 'totalTarget', label: 'Target' },
    { key: 'realisasi', label: 'Realisasi' },
    { key: 'percentage', label: 'Pencapaian %' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'sales':
        return <span className="text-gray-700 font-medium">{item.sales}</span>;
      case 'totalTarget': {
        const rawTarget = item.raw_total_target || 0;
        if (rawTarget === 0) return '0';
        return rawTarget >= 1e9 ? `Rp ${(rawTarget / 1e9).toFixed(1)} M` : (rawTarget >= 1e6 ? `Rp ${(rawTarget / 1e6).toFixed(1)} Jt` : `Rp ${rawTarget.toLocaleString('id-ID')}`);
      }
      case 'realisasi': {
        const rawReal = (item.realisasi_deco || 0) + (item.realisasi_auto || 0) + (item.realisasi_ind || 0);
        if (rawReal === 0) return '0';
        return rawReal >= 1e9 ? `Rp ${(rawReal / 1e9).toFixed(1)} M` : (rawReal >= 1e6 ? `Rp ${(rawReal / 1e6).toFixed(1)} Jt` : `Rp ${rawReal.toLocaleString('id-ID')}`);
      }
      case 'percentage':
        return (
          <span className={clsx(
            "font-semibold",
            item.percentage >= 100 ? "text-[#10b981]" : "text-amber-500"
          )}>
            {item.percentage}%
          </span>
        );
      case 'detail':
        return (
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors cursor-pointer">
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <MainLayout sidebarItems={supervisorMenuItems}>
      <Topbar title="Dashboard Supervisor" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

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
            title={chartCardTitle}
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
          />
        </div>

        {/* Performance Table */}
        <div className="mb-8">
          <DataTable 
            title="Tabel Performa Sales"
            columns={tableColumns}
            data={salesTableData}
            renderCell={renderTableCell}
          />
        </div>

        {/* Top 10 Produk */}
        <TopProductsCard data={topProducts} title="Top 10 Produk Terlaris Tim" />

      </div>
    </MainLayout>
  );
};
