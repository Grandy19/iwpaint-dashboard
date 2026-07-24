import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Users, Target, User, Eye, CheckCircle2, XCircle, Banknote, Wallet, UserCircle, Mail, Phone, Lock, EyeOff, Map, Briefcase, Info, MapPin, LayoutDashboard } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const DistributorSalesPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');
  const [sales, setSales] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

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
          title: sales === 'Semua Sales' ? 'Total Sales' : 'Total Penjualan',
          value: sales === 'Semua Sales' ? `${filteredSales.length} Sales` : (kpisVal.total_sales >= 1e9 ? `Rp ${(kpisVal.total_sales / 1e9).toFixed(1)} M` : `Rp ${(kpisVal.total_sales / 1e6).toFixed(1)} Jt`),
          description: sales === 'Semua Sales' ? 'Total sales di regional Anda' : `Total penjualan oleh ${sales}`,
          icon: sales === 'Semua Sales' ? Users : Banknote,
          iconColor: sales === 'Semua Sales' ? 'text-[#3b82f6]' : 'text-[#10b981]',
          iconBg: sales === 'Semua Sales' ? 'bg-[#dbeafe]' : 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Customer Ditangani',
          value: `${kpisVal.total_customers} Customer`,
          description: sales === 'Semua Sales' ? 'Total customer yang ditangani' : `Total customer yang dikelola oleh ${sales}`,
          icon: Users,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Total Transaksi',
          value: `${kpisVal.total_transactions || 0} Transaksi`,
          description: sales === 'Semua Sales' ? 'Total transaksi dari semua sales' : `Total transaksi oleh ${sales}`,
          icon: Wallet,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        }
      ]);

    } catch (err) {
      console.error('Failed to load distributor sales list:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const isAllSales = sales === 'Semua Sales';
  const selectedSalesData = (!isAllSales ? salesData.find(s => s.namaSales === sales) : null) as any;

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
    { key: 'namaSales', label: 'Nama Sales' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'status', label: 'Status' },
    { key: 'detail', label: 'Detail' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSales':
        return <span className="text-gray-700 font-medium">{item.namaSales}</span>;
      case 'status':
        return item.status === 'Aktif' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Aktif
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
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
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const filteredSalesData = salesData.filter((s: any) => {
    if (supervisor !== 'Semua Supervisor' && s.supervisor !== supervisor) return false;
    if (sales !== 'Semua Sales' && s.namaSales !== sales) return false;
    return true;
  });

  return (
    <MainLayout sidebarItems={distributorMenuItems}>
      <Topbar title="Sales Dikelola" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

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

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={supervisorOptions} 
              />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={setSales} 
                options={salesOptions} 
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Table or Detail Section */}
        {isAllSales ? (
          <DataTable
            title="Daftar Sales Penjualan"
            columns={tableColumns}
            data={filteredSalesData}
            renderCell={renderTableCell}
          />
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
            <h3 className="text-gray-600 text-[18px] font-medium mb-6 font-semibold">Informasi Detail Sales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Nama Sales</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.namaSales || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserCircle size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.username || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input type="email" value={selectedSalesData?.email || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Nomor HP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.nomorHp || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.alamat || 'Jl. Sudirman No 12 Bandung'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Map size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.area || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Briefcase size={18} />
                  </div>
                  <input type="text" value={selectedSalesData?.supervisor || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
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
        mode="detail"
        data={selectedSales}
      />
    </MainLayout>
  );
};
