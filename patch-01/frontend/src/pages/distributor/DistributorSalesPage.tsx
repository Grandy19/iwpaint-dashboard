import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Users, Target, User, Eye, CheckCircle2, XCircle, Banknote, Package, UserCircle, Mail, Phone, Lock, EyeOff, Map, Briefcase, Info, MapPin, LayoutDashboard, UserCheck } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';
import { TopSalesPerformance } from '../../components/ui/TopSalesPerformance';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ExportModal } from '../../components/ui/ExportModal';

export const DistributorSalesPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-30');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');
  const [sales, setSales] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic states
  const [salesData, setSalesData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);
  const [supervisorOptions, setSupervisorOptions] = useState<string[]>(['Semua Supervisor']);

  const loadData = async () => {
    if (!user) return;
    try {
      const myArea = user.area || '';
      const res = await api.get('/users?role=sales');
      const allSales = res.data.data;

      // Filter sales by regional area cities
      const targetAreaLower = myArea.toLowerCase();
      let areaCities: string[] = [];
      if (targetAreaLower.includes("jawa barat") || targetAreaLower === "jabar") {
        areaCities = ["bandung", "cirebon", "kuningan", "tasikmalaya", "garut", "bogor"];
      } else if (targetAreaLower.includes("jawa tengah") || targetAreaLower === "jateng") {
        areaCities = ["semarang", "solo", "yogyakarta", "purwokerto", "tegal", "cilacap"];
      } else if (targetAreaLower.includes("jawa timur") || targetAreaLower === "jatim") {
        areaCities = ["surabaya", "malang", "kediri", "jember", "madiun", "banyuwangi"];
      } else {
        areaCities = [targetAreaLower];
      }

      const filteredSales = allSales.filter((s: any) => s.area && areaCities.includes(s.area.toLowerCase()));
      setSalesData(filteredSales);

      setSalesOptions(['Semua Sales', ...filteredSales.map((s: any) => s.namaSales)]);
      
      const sups = Array.from(new Set(filteredSales.map((s: any) => s.supervisor).filter(Boolean))) as string[];
      setSupervisorOptions(['Semua Supervisor', ...sups]);

      // KPIs
      const kpiParams: any = { area: myArea, periodeAwal, periodeAkhir };
      if (supervisor !== 'Semua Supervisor') kpiParams.supervisor = supervisor;
      if (sales !== 'Semua Sales') kpiParams.salesman = sales;

      const kpiRes = await api.get('/sales/kpis', { params: kpiParams });
      const kpisVal = kpiRes.data;

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan Area (RP)',
          value: kpisVal.total_sales >= 1e9 ? `Rp ${(kpisVal.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpisVal.total_sales / 1e6).toFixed(1)} Jt`,
          description: sales === 'Semua Sales' ? 'Total penjualan keseluruhan' : `Total penjualan oleh ${sales}`,
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Qty Penjualan (KG)',
          value: `${Number(kpisVal.total_weight || 0).toLocaleString('id-ID')} Kg`,
          description: sales === 'Semua Sales' ? 'Total qty penjualan keseluruhan' : `Total qty penjualan oleh ${sales}`,
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Sales',
          value: `${filteredSales.length} Sales`,
          description: 'Total anggota sales yang terdaftar',
          icon: User,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

    } catch (err) {
      console.error('Failed to load distributor sales list:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, periodeAwal, periodeAkhir, supervisor, sales]);

  const isAllSales = sales === 'Semua Sales';
  const selectedSalesData = (!isAllSales ? salesData.find(s => s.namaSales === sales) : null) as any;

  const ActionButtons = (
    <button 
      onClick={() => setIsExportModalOpen(true)}
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
    >
      <Download size={18} />
      Export Data
    </button>
  );

    const distributorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
    { name: 'Sales', icon: User, path: '/distributor-dashboard/sales' },
    { name: 'Supervisor', icon: UserCheck, path: '/distributor-dashboard/supervisor' },
    { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/distributor-dashboard/target-sales' },
  ];

  const tableColumns = [
    { key: 'namaSales', label: 'Nama Sales', className: 'w-[20%]' },
    { key: 'email', label: 'Email', className: 'w-[22%]' },
    { key: 'nomorHp', label: 'Nomor HP', className: 'w-[15%]' },
    { key: 'area', label: 'Area', className: 'w-[13%]' },
    { key: 'supervisor', label: 'Supervisor', className: 'w-[15%]' },
    { key: 'status', label: 'Status', align: 'center', className: 'w-[10%]' },
    { key: 'detail', label: 'Detail', align: 'center', className: 'w-[5%]' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSales':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.namaSales}</span>;
      case 'email':
      case 'nomorHp':
      case 'area':
      case 'supervisor':
        return <span className="whitespace-nowrap">{item[columnKey]}</span>;
      case 'status':
        return item.status === 'Aktif' ? (
          <span className="flex items-center justify-center gap-1.5 text-[#10b981] font-medium whitespace-nowrap">
            <CheckCircle2 size={16} /> Aktif
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 text-[#ef4444] font-medium whitespace-nowrap">
            <XCircle size={16} /> Tidak Aktif
          </span>
        );

      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedSales(item);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer shadow-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap">
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return <span className="whitespace-nowrap">{item[columnKey]}</span>;
    }
  };

  const filteredSalesData = salesData.filter((s: any) => {
    if (supervisor !== 'Semua Supervisor' && s.supervisor !== supervisor) return false;
    if (sales !== 'Semua Sales' && s.namaSales !== sales) return false;
    return true;
  });

  const absensiColumns = [
    { key: 'tanggal', label: 'Tanggal', className: 'w-[13%]' },
    { key: 'namaSales', label: 'Nama Sales', className: 'w-[20%]' },
    { key: 'area', label: 'Area', className: 'w-[13%]' },
    { key: 'loginPagi', label: 'Login Pagi', className: 'w-[13%]' },
    { key: 'loginSore', label: 'Login Sore', className: 'w-[13%]' },
    { key: 'aktivitasTerakhir', label: 'Aktivitas Terakhir', className: 'w-[14%]' },
    { key: 'totalLoginHariIni', label: 'Total Login Hari Ini', align: 'center', className: 'w-[14%]' },
  ];

  const renderAbsensiCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSales':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.namaSales}</span>;
      case 'totalLoginHariIni': {
        const idLen = item.id ? String(item.id).length : 5;
        const nameLen = (item.namaSales || '').length || 10;
        const total = 1 + ((idLen + nameLen) % 4);
        return <span className="whitespace-nowrap flex items-center justify-center">{total}x</span>;
      }
      default:
        return <span className="whitespace-nowrap">{item[columnKey]}</span>;
    }
  };

  const dummyAbsensiData = filteredSalesData.map((s: any, idx: number) => {
    const isHadir = idx % 3 !== 2;
    const isTerlambat = idx % 4 === 1;
    let status = isHadir ? 'Hadir' : 'Tidak Hadir';
    if (isHadir && isTerlambat) status = 'Terlambat';
    const isCentang = idx === 2;

    return {
      ...s,
      tanggal: '12 Agu 2026',
      loginPagi: status === 'Tidak Hadir' ? '-' : (isCentang ? '✓' : (status === 'Terlambat' ? '08:21' : '07:58')),
      loginSore: status === 'Tidak Hadir' ? '-' : (isCentang ? '✓' : (status === 'Terlambat' ? '-' : '16:42')),
      status,
      aktivitasTerakhir: status === 'Tidak Hadir' ? '-' : (isCentang ? '17:02' : (status === 'Terlambat' ? '08:24' : '16:45')),
    };
  });

  return (
    <>
      <MainLayout sidebarItems={distributorMenuItems}>
        <Topbar title="Sales Dikelola" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-6 items-end">
            <div className="w-full lg:w-[400px] flex-none">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Periode</label>
              <div className="flex items-center justify-center gap-3">
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
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={supervisorOptions} 
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={setSales} 
                options={salesOptions} 
                showSearch={true}
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Top Sales Performance Section */}
        <div className="mb-8">
          <TopSalesPerformance />
        </div>

        {/* Table or Detail Section */}
        {isAllSales ? (
          <div className="flex flex-col">
            <DataTable tableLayout="auto"
              title="Daftar Sales Penjualan"
              columns={tableColumns}
              data={filteredSalesData}
              renderCell={renderTableCell}
            />
            <DataTable tableLayout="auto"
              title="Riwayat Absensi Sales"
              columns={absensiColumns}
              data={dummyAbsensiData}
              renderCell={renderAbsensiCell}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
            <h3 className="text-gray-600 text-[18px] font-medium mb-6 font-semibold">Informasi Detail Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Nama Sales</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.namaSales || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserCircle size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.username || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input type="email" value={selectedSalesData?.email || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Nomor HP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.nomorHp || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Alamat</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.alamat || 'Jl. Sudirman No 12 Bandung'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Map size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.area || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Supervisor</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Briefcase size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.supervisor || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Status</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Info size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.status || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <SalesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="view_only"
        data={selectedSales}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName="sales-distributor.pdf"
      />
      </MainLayout>
    </>
  );
};
