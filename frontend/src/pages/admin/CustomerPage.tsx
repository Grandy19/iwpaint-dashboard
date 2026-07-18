import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Filter, Eye, Package, Download, User, Users, Receipt, Map, MapPin, Wallet, CalendarClock } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { ExportModal } from '../../components/ui/ExportModal';
import { ImportModal } from '../../components/ui/ImportModal';
import { CustomerModal } from '../../components/ui/CustomerModal';
import { customerKpiData, customerTableData, transactionTableData } from '../../mock/customer';

export const CustomerPage = () => {
  const [area, setArea] = useState('Semua Area');
  const [status, setStatus] = useState('Semua Status');
  const [salesName, setSalesName] = useState('Semua Sales');
  const [customerName, setCustomerName] = useState('Semua Customer');

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const isAllCustomers = customerName === 'Semua Customer';
  const selectedCustomerData = customerTableData.find(c => c.namaCustomer === customerName) || customerTableData[0];

  const ActionButtons = (
    <div className="flex gap-4">
      <button 
        onClick={() => setIsExportModalOpen(true)}
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => setIsImportModalOpen(true)}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Download size={18} />
        Import Data
      </button>
    </div>
  );

  const customerColumns = [
    { key: 'namaCustomer', label: 'Nama Customer' },
    { key: 'kodeCustomer', label: 'Kode Customer' },
    { key: 'sales', label: 'Sales' },
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

  return (
    <>
      <MainLayout>
        <Topbar title="Customer" subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB" actionButton={ActionButtons} />

        <div className="px-8 pb-10">
          
          {/* Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <CustomSelect 
                  value={area} 
                  onChange={setArea} 
                  options={['Semua Area', 'Cirebon', 'Bandung', 'Jakarta']} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
                <CustomSelect 
                  value={status} 
                  onChange={setStatus} 
                  options={['Semua Status', 'Aktif', 'Tidak Aktif']} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
                <CustomSelect 
                  value={salesName} 
                  onChange={setSalesName} 
                  options={['Semua Sales', 'Budi', 'Fransiskus', 'Rudi']} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Customer</label>
                <CustomSelect 
                  value={customerName} 
                  onChange={setCustomerName} 
                  options={['Semua Customer', 'TB Bangun Jaya', 'CV Sinar Mas', 'TB Toko Sejati']} 
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
            {customerKpiData.map((kpi) => {
              if (isAllCustomers) return <KpiCard key={kpi.id} {...kpi} />;
              
              if (kpi.id === 1) {
                return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalPenjualan || 'Rp 20 Jt'} description="Total penjualan untuk customer terpilih" />;
              }
              if (kpi.id === 2) {
                return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalTransaksi ? `${selectedCustomerData.totalTransaksi} Transaksi` : '300 Transaksi'} description="Total transaksi untuk customer terpilih" />;
              }
              if (kpi.id === 3) {
                return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalQty || '1.500 Kg'} description="Total qty penjualan untuk customer terpilih" />;
              }
              
              return <KpiCard key={kpi.id} {...kpi} />;
            })}
          </div>

          {/* Customer Info or Table */}
          {isAllCustomers ? (
            <DataTable
              title="Tabel Customer"
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
                    <input type="text" value={selectedCustomerData?.sales || ''} readOnly className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors" />
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

          {/* Table Transaksi */}
          <DataTable
            title={isAllCustomers ? "Tabel Transaksi Seluruh Customer" : "Tabel Transaksi Customer Terpilih"}
            columns={transactionColumns}
            data={isAllCustomers 
              ? transactionTableData 
              : transactionTableData.map(item => ({ ...item, customer: customerName }))}
            renderCell={renderTransactionCell}
          />

        </div>
      </MainLayout>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Customer.xlsx" 
      />

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />
      
      <CustomerModal 
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        data={selectedCustomer}
      />
    </>
  );
};
