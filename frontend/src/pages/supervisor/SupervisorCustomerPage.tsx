import { useState, useMemo } from 'react';
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
import { salesChartData, salesTopProductsData } from '../../mock/salesDashboard';
import { supervisorCustomerKpiData, supervisorCustomerTableData, supervisorTransactionTableData } from '../../mock/supervisorCustomer';

export const SupervisorCustomerPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('01 Juli 2026');
  const [sales, setSales] = useState('Semua Sales');
  const [customer, setCustomer] = useState('Semua Customer');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  const [appliedSales, setAppliedSales] = useState('Semua Sales');
  const [appliedCustomer, setAppliedCustomer] = useState('Semua Customer');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');

  const handleFilter = () => {
    setAppliedSales(sales);
    setAppliedCustomer(customer);
  };

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
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
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

  const isAllCustomers = appliedCustomer === 'Semua Customer';
  const isAllSales = appliedSales === 'Semua Sales';

  const isSpecificCustomer = !isAllCustomers;
  const isSpecificSalesOnly = !isAllSales && isAllCustomers;

  const displayKpiData = useMemo(() => {
    if (isSpecificSalesOnly) {
      return supervisorCustomerKpiData.map(kpi => {
        if (kpi.id === 1) return { ...kpi, title: 'Total Penjualan' };
        if (kpi.id === 3) return { ...kpi, title: 'Total QTY Penjualan', description: 'Total qty pembelian customer yang ditangani sales terpilih', value: '4.800 Kg' };
        return kpi;
      });
    }
    if (isSpecificCustomer) {
      return supervisorCustomerKpiData.map(kpi => {
        if (kpi.id === 1) return { ...kpi, value: 'Rp 20 Jt' };
        if (kpi.id === 2) return { ...kpi, value: '300 Transaksi' };
        if (kpi.id === 3) return { ...kpi, title: 'Total Qty Penjualan', description: 'Total qty pembelian customer terpilih', value: '45 Kg' };
        return kpi;
      });
    }
    return supervisorCustomerKpiData; // Default: Total Penjualan, Total Transaksi, Total Customer
  }, [isSpecificSalesOnly, isSpecificCustomer]);

  const displayCustomersTable = useMemo(() => {
    if (isSpecificSalesOnly) {
      return supervisorCustomerTableData.filter(c => c.sales === appliedSales);
    }
    return supervisorCustomerTableData;
  }, [isSpecificSalesOnly, appliedSales]);

  const displayTransactions = useMemo(() => {
    if (isSpecificCustomer) {
      return supervisorTransactionTableData.map(t => ({ ...t, customer: appliedCustomer }));
    }
    if (isSpecificSalesOnly) {
      const allowedCustomers = supervisorCustomerTableData.filter(c => c.sales === appliedSales).map(c => c.namaCustomer);
      return supervisorTransactionTableData.filter(t => allowedCustomers.includes(t.customer));
    }
    return supervisorTransactionTableData;
  }, [isSpecificCustomer, isSpecificSalesOnly, appliedCustomer, appliedSales]);

  const displayTopProducts = useMemo(() => {
    if (isSpecificSalesOnly) {
      return salesTopProductsData.map(item => ({
        ...item,
        value: item.value * 0.8,
        label: `Rp ${(item.value * 0.8 / 1000000).toFixed(0)} Jt`
      }));
    }
    if (isSpecificCustomer) {
      return salesTopProductsData.map(item => ({
        ...item,
        value: item.value * 0.6,
        max: 80000000,
        label: `Rp ${(item.value * 0.6 / 1000000).toFixed(0)} Jt`
      }));
    }
    return salesTopProductsData;
  }, [isSpecificSalesOnly, isSpecificCustomer]);

  const dynamicChartData = useMemo(() => {
    if (chartPeriode === 'Hari') {
      const baseData = Array.from({ length: 30 }, (_, i) => {
        const day = (i + 1).toString().padStart(2, '0');
        return {
          date: `${day}/07/2026`,
          value: Math.floor(40000000 + Math.random() * 60000000)
        };
      });
      for (let i = 0; i < salesChartData.length; i++) {
        baseData[i] = salesChartData[i];
      }
      if (chartJenisData === 'Total Qty') {
        return baseData.map(item => ({ ...item, value: item.value / 10000 }));
      }
      return baseData;
    } else if (chartPeriode === 'Bulan') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      return months.map(m => ({
        date: m,
        value: Math.floor(400000000 + Math.random() * 600000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    } else if (chartPeriode === 'Tahun') {
      const years = ['2023', '2024', '2025', '2026'];
      return years.map(y => ({
        date: y,
        value: Math.floor(400000000 + Math.random() * 600000000) / (chartJenisData === 'Total Qty' ? 10000 : 1)
      }));
    }
    return salesChartData;
  }, [chartPeriode, chartJenisData]);

  const selectedCustomerData = (supervisorCustomerTableData.find(c => c.namaCustomer === appliedCustomer) || supervisorCustomerTableData[0]) as any;

  return (
    <>
      <MainLayout sidebarItems={supervisorMenuItems}>
        <Topbar title="Customer" subtitle="Pantau customer yang dikelola oleh tim sales." actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          
          {/* Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-end">
              <div className="col-span-2">
                <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <CustomSelect 
                      value={periodeAwal} 
                      onChange={setPeriodeAwal} 
                      options={['01 Juli 2026', '02 Juli 2026', '03 Juli 2026']} 
                      showSearch={true}
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <CustomSelect 
                      value={periodeAkhir} 
                      onChange={setPeriodeAkhir} 
                      options={['01 Juli 2026', '02 Juli 2026', '03 Juli 2026']} 
                      showSearch={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
                <CustomSelect 
                  value={sales} 
                  onChange={(val) => {
                    setSales(val);
                    setAppliedSales(val);
                    if (val !== 'Semua Sales') {
                      setCustomer('Semua Customer');
                      setAppliedCustomer('Semua Customer');
                    }
                  }} 
                  options={['Semua Sales', 'Budi', 'Fransiskus']} 
                  showSearch={true}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-[#475569] font-medium mb-2">Customer</label>
                <CustomSelect 
                  value={customer} 
                  onChange={(val) => {
                    setCustomer(val);
                    setAppliedCustomer(val);
                  }} 
                  options={['Semua Customer', 'TB Bangun Jaya', 'CV Sinar Mas', 'TB Toko Sejati', 'TB Sejahtera', 'CV Cirebon I']} 
                  showSearch={true}
                />
              </div>
              
              <div className="col-span-1">
                <button 
                  onClick={handleFilter}
                  className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]"
                >
                  <Filter size={18} />
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {displayKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Table Customer */}
          {isSpecificCustomer ? (
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
                    <input type="text" value={selectedCustomerData?.area || 'Bandung'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Sales yang Menangani</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Users size={18} />
                    </div>
                    <input type="text" value={selectedCustomerData?.sales || 'Budi'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input type="text" value={selectedCustomerData?.alamat || 'Jl. Moh Toha No.18'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
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
                    <input type="text" value={selectedCustomerData?.totalQty || '230 Kg'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#475569] font-medium mb-2">Transaksi Terakhir</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <CalendarClock size={18} />
                    </div>
                    <input type="text" value={selectedCustomerData?.transaksiTerakhir || '13 Juli 2026'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <DataTable
              title="Tabel Keseluruhan Customer Berdasarkan Total Penjualan"
              columns={customerColumns}
              data={displayCustomersTable}
              renderCell={renderCustomerCell}
            />
          )}

          {/* Tren Pembelian Customer */}
          <div className="mb-8">
            <ChartCard 
              data={dynamicChartData} 
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
              filterAktifLabel={`${periodeAwal} - ${periodeAkhir}`}
            />
          </div>

          {/* Top 10 Produk */}
          <TopProductsCard 
            data={displayTopProducts} 
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
            data={displayTransactions}
            renderCell={renderTransactionCell}
          />

        </div>
      </MainLayout>

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
    </>
  );
};
