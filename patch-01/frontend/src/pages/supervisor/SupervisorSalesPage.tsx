import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye, CheckCircle2, XCircle, Banknote, Package, UserCircle, Mail, Phone, Lock, EyeOff, Map, Briefcase, Info, MapPin } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';
import { TopSalesPerformance } from '../../components/ui/TopSalesPerformance';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ExportModal } from '../../components/ui/ExportModal';

export const SupervisorSalesPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-30');
  const [sales, setSales] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic states
  const [salesData, setSalesData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);
  const [absensiData, setAbsensiData] = useState<any[]>([]);

  const loadData = async () => {
    if (!user) return;
    try {
      // Fetch sales under this supervisor
      const res = await api.get(`/users?role=sales&supervisor_name=${user.name}`);
      const mySales = res.data.data;
      setSalesData(mySales);
      setSalesOptions(['Semua Sales', ...mySales.map((s: any) => s.namaSales)]);

      // Load general KPIs for the team in the date range
      const kpiParams: any = { supervisor: user.name, periodeAwal, periodeAkhir };
      if (sales !== 'Semua Sales') {
        kpiParams.salesman = sales;
      }
      const kpisRes = await api.get('/sales/kpis', { params: kpiParams });
      const kpisVal = kpisRes.data;

      // Load attendance
      const attRes = await api.get(`/attendance?supervisor_name=${user.name}`);
      let absensiList = attRes.data.data;
      if (sales !== 'Semua Sales') {
        absensiList = absensiList.filter((s: any) => s.sales === sales);
      }
      setAbsensiData(absensiList);

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan Tim (RP)',
          value: kpisVal.total_sales >= 1e9 ? `Rp ${(kpisVal.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpisVal.total_sales / 1e6).toFixed(1)} Jt`,
          description: sales === 'Semua Sales' ? 'Total penjualan keseluruhan' : `Total penjualan oleh ${sales}`,
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Qty Penjualan (Kg)',
          value: `${Number(kpisVal.total_weight || 0).toLocaleString('id-ID')} Kg`,
          description: sales === 'Semua Sales' ? 'Total qty penjualan keseluruhan' : `Total qty penjualan oleh ${sales}`,
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Sales',
          value: `${mySales.length} Sales`,
          description: 'Total anggota sales yang terdaftar',
          icon: User,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);
    } catch (err) {
      console.error('Failed to load supervisor sales:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, periodeAwal, periodeAkhir, sales]);

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

  const supervisorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor-dashboard' },
    { name: 'Sales', icon: User, path: '/supervisor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/supervisor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/supervisor-dashboard/target-sales' },
  ];

  const tableColumns = [
    { key: 'namaSales', label: 'Nama Sales', className: 'w-[25%]' },
    { key: 'email', label: 'Email', className: 'w-[25%]' },
    { key: 'nomorHp', label: 'Nomor HP', className: 'w-[18%]' },
    { key: 'area', label: 'Area', className: 'w-[15%]' },
    { key: 'status', label: 'Status', align: 'center', className: 'w-[10%]' },
    { key: 'detail', label: 'Detail', align: 'center', className: 'w-[7%]' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSales':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.namaSales}</span>;
      case 'email':
      case 'nomorHp':
      case 'area':
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
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.sales}</span>;
      case 'tanggal':
        return <span className="whitespace-nowrap">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>;
      case 'loginPagi':
        return <span className="whitespace-nowrap">{item.has_pagi ? '✓' : '-'}</span>;
      case 'loginSore':
        return <span className="whitespace-nowrap">{item.has_sore ? '✓' : '-'}</span>;
      case 'aktivitasTerakhir':
        if (!item.last_activity) return <span className="whitespace-nowrap">-</span>;
        const lastAct = new Date(item.last_activity);
        return <span className="whitespace-nowrap">{lastAct.getHours().toString().padStart(2, '0')}:{lastAct.getMinutes().toString().padStart(2, '0')}</span>;
      case 'totalLoginHariIni': {
        return <span className="whitespace-nowrap flex items-center justify-center">{item.login_count}x</span>;
      }
      default:
        return <span className="whitespace-nowrap">{item[columnKey]}</span>;
    }
  };

  return (
    <>
      <MainLayout sidebarItems={supervisorMenuItems}>
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
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                    value={periodeAwal}
                    onChange={(e) => setPeriodeAwal(e.target.value)}
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                    value={periodeAkhir}
                    onChange={(e) => setPeriodeAkhir(e.target.value)}
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
              data={salesData}
              renderCell={renderTableCell}
            />
            <DataTable tableLayout="auto"
              title="Riwayat Absensi Sales"
              columns={absensiColumns}
              data={absensiData}
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
        fileName="sales-supervisor.pdf"
      />
      </MainLayout>
    </>
  );
};
