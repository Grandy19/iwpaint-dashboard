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

export const SalesCustomerPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [customer, setCustomer] = useState('Semua Customer');
  const [appliedCustomer, setAppliedCustomer] = useState('Semua Customer');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Dynamic states
  const [customersData, setCustomersData] = useState<any[]>([]);
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<string[]>(['Semua Customer']);
  
  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Bulan');
  const [trendData, setTrendData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const loadData = async () => {
    if (!user) return;
    try {
      const params: any = { salesName: user.name, periodeAwal, periodeAkhir };
      const res = await api.get('/customers', { params });
      const myCustomers = res.data.data;
      setCustomersData(myCustomers);

      setCustomerOptions(['Semua Customer', ...myCustomers.map((c: any) => c.namaCustomer)]);

      // Calculate KPI metrics
      const totalSalesVal = myCustomers.reduce((acc: number, c: any) => acc + c.raw_total_penjualan, 0);
      const totalTxVal = myCustomers.reduce((acc: number, c: any) => acc + Number(c.totalTransaksi), 0);
      const totalQtyVal = myCustomers.reduce((acc: number, c: any) => acc + Number(c.raw_total_qty || 0), 0);

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: totalSalesVal >= 1e9 ? `Rp ${(totalSalesVal / 1e9).toFixed(1)} M` : `Rp ${(totalSalesVal / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan keseluruhan',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Transaksi',
          value: `${totalTxVal.toLocaleString('id-ID')} Transaksi`,
          description: 'Total transaksi periode terpilih',
          icon: Receipt,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Total Qty Penjualan',
          value: `${totalQtyVal.toLocaleString('id-ID')} Kg`,
          description: 'Total qty penjualan untuk customer terpilih',
          icon: Package,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);

    } catch (err) {
      console.error('Failed to load sales customer data:', err);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const params: any = { salesName: user.name, periodeAwal, periodeAkhir };
      if (appliedCustomer !== 'Semua Customer') {
        params.customerName = appliedCustomer;
      }
      const res = await api.get('/customers/transactions', { params });
      setTransactionsData(res.data.data);
    } catch (err) {
      console.error('Failed to load customer transactions:', err);
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
      if (appliedCustomer !== 'Semua Customer') {
        params.customerName = appliedCustomer;
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

  const loadTopProducts = async () => {
    if (!user) return;
    try {
      const salesmanName = user.name;
      const params: any = { 
        salesman: salesmanName,
        periodeAwal,
        periodeAkhir
      };
      if (appliedCustomer !== 'Semua Customer') {
        params.customerName = appliedCustomer;
      }
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
      console.error('Failed to load top products:', err);
    }
  };

  useEffect(() => {
    loadData();
    loadTransactions();
    loadTrendData();
    loadTopProducts();
  }, [user, appliedCustomer, periodeAwal, periodeAkhir]);

  useEffect(() => {
    loadTrendData();
  }, [chartPeriode, chartJenisData]);

  const handleFilter = () => {
    setAppliedCustomer(customer);
  };

  const isAllCustomers = appliedCustomer === 'Semua Customer';
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

  const salesMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/sales-dashboard' },
    { name: 'Customer', icon: Users, path: '/sales-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/sales-dashboard/target' },
  ];

  return (
    <MainLayout sidebarItems={salesMenuItems}>
      <Topbar title="Customer" subtitle="Daftar customer yang telah melakukan pembelian" actionButton={ActionButtons} />

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
              return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan keseluruhan" />;
            }
            if (kpi.id === 2) {
              return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalTransaksi ? `${selectedCustomerData.totalTransaksi} Transaksi` : '0 Transaksi'} description="Total transaksi periode terpilih" />;
            }
            if (kpi.id === 3) {
              return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
            }
            
            return <KpiCard key={kpi.id} {...kpi} />;
          })}
        </div>

        {/* Customer Info or Table */}
        {isAllCustomers ? (
          <DataTable
            title="Tabel Keseluruhan Customer Berdasarkan Total Penjualan"
            columns={customerColumns}
            data={customersData}
            renderCell={renderCustomerCell}
          />
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
            title={isAllCustomers ? "Tren Pembelian Keseluruhan Customer" : `Tren Pembelian Customer ${appliedCustomer}`}
            jenisData={chartJenisData}
            setJenisData={setChartJenisData}
            periode={chartPeriode}
            setPeriode={setChartPeriode}
          />
        </div>

        {/* Top 10 Produk */}
        <TopProductsCard 
          data={topProducts} 
          title={isAllCustomers ? "Top 10 Produk Terlaris Penjualan Keseluruhan Customer" : `Top 10 Produk Terlaris Penjualan Customer ${appliedCustomer}`} 
        />

        {/* Table Transaksi */}
        <DataTable
          title={isAllCustomers ? "Tabel Transaksi Seluruh Customer" : `Tabel Transaksi Customer ${appliedCustomer}`}
          columns={transactionColumns}
          data={transactionsData}
          renderCell={renderTransactionCell}
        />

      </div>
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Customer.xlsx" 
      />
      <CustomerModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        data={selectedCustomer}
      />
    </MainLayout>
  );
};
