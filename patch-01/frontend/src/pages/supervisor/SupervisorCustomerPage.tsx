import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Eye, LayoutDashboard, Users, Target, User, Map, MapPin, Receipt, Wallet, Package, CalendarClock } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { CustomerModal } from '../../components/ui/CustomerModal';
import { ChartCard } from '../../components/ui/ChartCard';
import { TopProductsCard } from '../../components/ui/TopProductsCard';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const SupervisorCustomerPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [sales, setSales] = useState('Semua Sales');
  const [customer, setCustomer] = useState('Semua Customer');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const [appliedSales, setAppliedSales] = useState('Semua Sales');
  const [appliedCustomer, setAppliedCustomer] = useState('Semua Customer');
  const [refreshKey, setRefreshKey] = useState(0);

  // Dynamic states
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);
  const [customerOptions, setCustomerOptions] = useState<string[]>(['Semua Customer']);

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');
  const [trendData, setTrendData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const loadData = async () => {
    if (!user) return;
    try {
      // Load sales names under this supervisor
      const salesRes = await api.get(`/users?role=sales&supervisor_name=${user.name}`);
      const mySales = salesRes.data.data;
      setSalesOptions(['Semua Sales', ...mySales.map((s: any) => s.namaSales)]);

      // Load customers
      const params: any = { supervisor: user.name, periodeAwal, periodeAkhir };
      if (appliedSales !== 'Semua Sales') params.salesName = appliedSales;
      if (appliedCustomer !== 'Semua Customer') params.customerName = appliedCustomer;

      const customersRes = await api.get('/customers', { params });
      const myCustomers = customersRes.data.data;
      setCustomersData(myCustomers);

      // Calculate KPI metrics
      const totalSalesVal = myCustomers.reduce((acc: number, c: any) => acc + c.raw_total_penjualan, 0);
      const totalTxVal = myCustomers.reduce((acc: number, c: any) => acc + Number(c.totalTransaksi), 0);
      const totalCustomersVal = myCustomers.length;

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: totalSalesVal >= 1e9 ? `Rp ${(totalSalesVal / 1e9).toFixed(1)} M` : `Rp ${(totalSalesVal / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan customer supervisi Anda',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Transaksi',
          value: `${totalTxVal.toLocaleString('id-ID')} Transaksi`,
          description: 'Total transaksi customer supervisi Anda',
          icon: Receipt,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Total Customer',
          value: `${totalCustomersVal.toLocaleString('id-ID')} Customer`,
          description: 'Total customer di bawah supervisi Anda',
          icon: Users,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        }
      ]);

      // Fetch top products
      const topProdParams: any = { supervisor: user.name, periodeAwal, periodeAkhir };
      if (appliedSales !== 'Semua Sales') topProdParams.salesman = appliedSales;
      if (appliedCustomer !== 'Semua Customer') topProdParams.customerName = appliedCustomer;

      const topProductsRes = await api.get('/sales/top-products', { params: topProdParams });
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
      console.error('Failed to load supervisor customers:', err);
    }
  };

  const loadTrendData = async () => {
    if (!user) return;
    try {
      const trendParams: any = { 
        supervisor: user.name, 
        periodeAwal, 
        periodeAkhir,
        periode: chartPeriode,
        jenisData: chartJenisData
      };
      if (appliedSales !== 'Semua Sales') trendParams.salesman = appliedSales;
      if (appliedCustomer !== 'Semua Customer') trendParams.customerName = appliedCustomer;

      const trendRes = await api.get('/sales/trend', { params: trendParams });
      const trend = trendRes.data;
      setTrendData(trend.labels.map((lbl: string, idx: number) => ({
        date: chartPeriode === 'Bulan' ? lbl.slice(0, 3) : lbl,
        value: trend.values[idx]
      })));
    } catch (err) {
      console.error('Failed to load trend data:', err);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const params: any = { supervisor: user.name, periodeAwal, periodeAkhir };
      if (appliedSales !== 'Semua Sales') params.salesName = appliedSales;
      if (appliedCustomer !== 'Semua Customer') params.customerName = appliedCustomer;

      const res = await api.get('/customers/transactions', { params });
      setTransactionsData(res.data.data);
    } catch (err) {
      console.error('Failed to load customer transactions:', err);
    }
  };

  const loadCustomerOptions = async () => {
    if (!user) return;
    try {
      const params: any = { supervisor: user.name };
      if (sales !== 'Semua Sales') params.salesName = sales;
      const res = await api.get('/customers', { params });
      const cOptions = ['Semua Customer', ...res.data.data.map((c: any) => c.namaCustomer)];
      setCustomerOptions(cOptions);
      if (!cOptions.includes(customer)) {
        setCustomer('Semua Customer');
      }
    } catch (err) {
      console.error('Failed to load customer options:', err);
    }
  };

  useEffect(() => {
    loadCustomerOptions();
  }, [user, sales]);

  useEffect(() => {
    loadData();
  }, [user, appliedSales, appliedCustomer, refreshKey]);

  useEffect(() => {
    loadTransactions();
  }, [user, appliedSales, appliedCustomer, refreshKey]);

  useEffect(() => {
    loadTrendData();
  }, [user, appliedSales, appliedCustomer, chartPeriode, chartJenisData, refreshKey]);

  const handleFilter = () => {
    setAppliedSales(sales);
    setAppliedCustomer(customer);
    setRefreshKey(prev => prev + 1);
  };

  const isAllCustomers = appliedCustomer === 'Semua Customer';
  const isAllSales = appliedSales === 'Semua Sales';

  const isSpecificCustomer = !isAllCustomers;
  const isSpecificSalesOnly = !isAllSales && isAllCustomers;

  const selectedCustomerData = (!isAllCustomers ? customersData.find(c => c.namaCustomer === appliedCustomer) : null) as any;

  const ActionButtons = (
    <button 
      onClick={() => setIsExportModalOpen(true)}
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const customerColumns = [
    { key: 'namaCustomer', label: 'Nama Customer' },
    { key: 'kodeCustomer', label: 'Kode Customer' },
    { key: 'alamat', label: 'Alamat' },
    { key: 'totalTransaksi', label: 'Total Transaksi' },
    { key: 'totalPenjualan', label: 'Total Penjualan' },
    { key: 'detail', label: 'Detail' },
  ];

  const transactionColumns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'noFaktur', label: 'No. Faktur' },
    { key: 'customer', label: 'Customer' },
    { key: 'produk', label: 'Produk' },
    { key: 'qty', label: 'QTY' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'totalPenjualan', label: 'Total Penjualan' },
  ];

  const renderCustomerCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaCustomer':
        return <span className="text-gray-700 font-medium">{item.namaCustomer}</span>;
      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedCustomer(item);
              setIsCustomerModalOpen(true);
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

  const renderTransactionCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'noFaktur':
        return <span className="text-gray-700 font-medium">{item.noFaktur}</span>;
      default:
        return item[columnKey];
    }
  };

  const supervisorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/supervisor-dashboard' },
    { name: 'Sales', icon: User, path: '/supervisor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/supervisor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/supervisor-dashboard/target-sales' },
  ];

  return (
    <MainLayout sidebarItems={supervisorMenuItems}>
      <Topbar title="Customer Sales" subtitle={`Selamat datang, ${user?.name || ''}`} actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-end">
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
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={sales} 
                onChange={setSales} 
                options={salesOptions} 
                showSearch={true}
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Customer</label>
              <CustomSelect 
                value={customer} 
                onChange={setCustomer} 
                options={customerOptions} 
                showSearch={true}
              />
            </div>
            
            <div className="col-span-1">
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi) => {
            if (isAllCustomers) return <KpiCard key={kpi.id} {...kpi} />;
            
            if (kpi.id === 1) {
              return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan untuk customer terpilih" />;
            }
            if (kpi.id === 2) {
              return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalTransaksi ? `${selectedCustomerData.totalTransaksi} Transaksi` : '0 Transaksi'} description="Total transaksi untuk customer terpilih" />;
            }
            if (kpi.id === 3) {
              return <KpiCard key={kpi.id} {...kpi} title="Total QTY (Kg)" value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
            }
            
            return <KpiCard key={kpi.id} {...kpi} />;
          })}
        </div>

        {/* Customer Info or Table */}
        {isAllCustomers ? (
          <div className="mb-8">
            <DataTable
              title="Tabel Keseluruhan Customer Berdasarkan Total Penjualan"
              columns={customerColumns}
              data={customersData}
              renderCell={renderCustomerCell}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
            <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Nama Customer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.namaCustomer || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Map size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.area || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales yang Menangani</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Users size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.sales || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.alamat || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Total Transaksi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Receipt size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.totalTransaksi ? `${selectedCustomerData.totalTransaksi} Transaksi` : ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Total Penjualan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Wallet size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.totalPenjualan || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Total QTY</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Package size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.totalQty || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Transaksi Terakhir</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <CalendarClock size={18} />
                  </div>
                  <input type="text" value={selectedCustomerData?.transaksiTerakhir || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tren Pembelian Customer */}
        <div className="mb-8">
          <ChartCard 
            data={trendData} 
            title={
              isSpecificCustomer 
                ? `Tren Pembelian Customer ${appliedCustomer}` 
                : isSpecificSalesOnly
                  ? `Tren Pembelian Keseluruhan Customer yang ditangani ${appliedSales}`
                  : "Tren Pembelian Keseluruhan Customer"
            }
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
          />
        </div>

        {/* Top 10 Produk */}
        <TopProductsCard 
          data={topProducts} 
          title={
            isSpecificCustomer 
              ? `Top 10 Produk Terlaris Penjualan Customer ${appliedCustomer}`
              : isSpecificSalesOnly
                ? `Top 10 Produk Terlaris Penjualan Keseluruhan Customer yang ditangani ${appliedSales}`
                : "Top 10 Produk Terlaris Penjualan Keseluruhan Customer"
          } 
        />

        {/* Table Transaksi */}
        <DataTable
          title={
            isSpecificCustomer 
              ? `Tabel Transaksi Customer ${appliedCustomer}`
              : isSpecificSalesOnly
                ? `Tabel Transaksi Seluruh Customer yang ditangani ${appliedSales}`
                : "Tabel Transaksi Seluruh Customer"
          }
          columns={transactionColumns}
          data={transactionsData}
          renderCell={renderTransactionCell}
        />

      </div>
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Customer_Supervisor.xlsx" 
      />
      <CustomerModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        data={selectedCustomer}
      />
    </MainLayout>
  );
};
