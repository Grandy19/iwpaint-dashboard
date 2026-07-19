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

import { 
  customerKpiData, 
  customerTableData, 
  customerTransactionData 
} from '../../mock/salesCustomer';

export const SalesCustomerPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('01 Juli 2026');
  const [customer, setCustomer] = useState('Semua Customer');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [appliedCustomer, setAppliedCustomer] = useState('Semua Customer');

  const [chartJenisData, setChartJenisData] = useState('Total Penjualan');
  const [chartPeriode, setChartPeriode] = useState('Hari');

  const handleFilter = () => {
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
    { key: 'area', label: 'Area' },
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

  const salesMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/sales-dashboard' },
    { name: 'Customer', icon: Users, path: '/sales-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/sales-dashboard/target' },
  ];

  const isAllCustomers = appliedCustomer === 'Semua Customer';
  const selectedCustomerData = (customerTableData.find(c => c.namaCustomer === appliedCustomer) || customerTableData[0]) as any;

  const displayKpiData = customerKpiData.map(kpi => {
    if (isAllCustomers) return kpi;
    if (kpi.id === 1) return { ...kpi, value: 'Rp 20 Jt' };
    if (kpi.id === 2) return { ...kpi, value: '300 Transaksi' };
    if (kpi.id === 3) return { ...kpi, value: '45 Kg' };
    return kpi;
  });

  const displayTransactions = isAllCustomers 
    ? customerTransactionData 
    : customerTransactionData.map(t => ({ ...t, customer: appliedCustomer }));

  const displayTopProducts = isAllCustomers 
    ? salesTopProductsData 
    : salesTopProductsData.map(item => ({
        ...item,
        value: item.value * 0.6,
        max: 80000000,
        label: `Rp ${(item.value * 0.6 / 1000000).toFixed(0)} Jt`
      }));

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

  return (
    <>
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
          {isAllCustomers ? (
            <DataTable
              title="Tabel Keseluruhan Customer Berdasarkan Total Penjualan"
              columns={customerColumns}
              data={customerTableData}
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
                    <input type="text" value={selectedCustomerData?.sales || 'Budi (Anda)'} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
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
          )}

          {/* Tren Pembelian Customer */}
          <div className="mb-8">
            <ChartCard 
              data={dynamicChartData} 
              title={isAllCustomers ? "Tren Pembelian Keseluruhan Customer" : `Tren Pembelian Customer ${appliedCustomer}`}
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
            title={isAllCustomers ? "Top 10 Produk Terlaris Penjualan Keseluruhan Customer" : `Top 10 Produk Terlaris Penjualan Customer ${appliedCustomer}`} 
          />

          {/* Table Transaksi */}
          <DataTable
            title={isAllCustomers ? "Tabel Transaksi Seluruh Customer" : `Tabel Transaksi Customer ${appliedCustomer}`}
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
