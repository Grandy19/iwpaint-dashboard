import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Eye, LayoutDashboard, Users, Target } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { CustomerModal } from '../../components/ui/CustomerModal';

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
                  onChange={setCustomer} 
                  options={['Semua Customer', 'TB Bangun Jaya', 'CV Sinar Mas', 'TB Toko Sejati', 'TB Sejahtera', 'CV Cirebon I']} 
                  showSearch={true}
                />
              </div>
              
              <div className="col-span-1">
                <button className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]">
                  <Filter size={18} />
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {customerKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Table Customer */}
          <DataTable
            title="Tabel Customer"
            columns={customerColumns}
            data={customerTableData}
            renderCell={renderCustomerCell}
          />

          {/* Table Transaksi */}
          <DataTable
            title="Tabel Transaksi Seluruh Customer"
            columns={transactionColumns}
            data={customerTransactionData}
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
