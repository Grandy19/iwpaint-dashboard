import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, LayoutDashboard, Users, Target, User, Eye, CheckCircle2, XCircle, Banknote, Wallet, UserCircle, Mail, Phone, Lock, EyeOff, Map, Briefcase, Info, MapPin } from 'lucide-react';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { SalesModal } from '../../components/ui/SalesModal';
import { supervisorSalesKpiData, supervisorSalesTableData } from '../../mock/supervisorSales';

export const SupervisorSalesPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('30 Juni 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [sales, setSales] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isAllSales = sales === 'Semua Sales';
  const selectedSalesData = supervisorSalesTableData.find(s => s.namaSales === sales) || supervisorSalesTableData[0];

  const currentKpiData = isAllSales ? supervisorSalesKpiData : [
    {
      id: 1,
      title: 'Total Penjualan',
      value: 'Rp 45 Jt',
      description: `Total penjualan oleh ${sales}`,
      icon: Banknote,
      iconColor: 'text-[#10b981]',
      iconBg: 'bg-[#dcfce7]',
    },
    {
      id: 2,
      title: 'Total Customer Ditangani',
      value: `${selectedSalesData.customer} Customer`,
      description: `Total customer yang dikelola oleh ${sales}`,
      icon: Users,
      iconColor: 'text-[#10b981]',
      iconBg: 'bg-[#dcfce7]',
    },
    {
      id: 3,
      title: 'Total Transaksi',
      value: `${selectedSalesData.transaksi} Transaksi`,
      description: `Total transaksi oleh ${sales}`,
      icon: Wallet,
      iconColor: 'text-[#10b981]',
      iconBg: 'bg-[#dcfce7]',
    }
  ];

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
    { key: 'namaSales', label: 'Nama Sales' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'customer', label: 'Customer' },
    { key: 'transaksi', label: 'Transaksi' },
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
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <>
      <MainLayout sidebarItems={supervisorMenuItems}>
        <Topbar title="Sales" subtitle="Pantau performa anggota tim sales" actionButton={ActionButtons} />

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
                      options={['30 Juni 2026', '01 Juli 2026', '02 Juli 2026']} 
                      showSearch={true}
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <CustomSelect 
                      value={periodeAkhir} 
                      onChange={setPeriodeAkhir} 
                      options={['30 Juni 2026', '01 Juli 2026', '02 Juli 2026']} 
                      showSearch={true}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
                <CustomSelect 
                  value={sales} 
                  onChange={setSales} 
                  options={['Semua Sales', 'Heri', 'Fransiskus', 'Rudi', 'Budi', 'Santoso', 'Agus', 'Iwan', 'Joko', 'Cipto', 'Gilang', 'Bagas', 'Wahyu']} 
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

          {/* KPI Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {currentKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Tabel Sales atau Informasi Sales */}
          <div className="mb-8">
            {isAllSales ? (
              <DataTable
                title="Tabel Sales"
                columns={tableColumns}
                data={supervisorSalesTableData}
                renderCell={renderTableCell}
              />
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-600 text-[18px] font-medium mb-6">Informasi Sales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Nama Sales</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.namaSales || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <UserCircle size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.username || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input type="email" readOnly value={selectedSalesData.email || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Nomor HP</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.nomorHp || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <MapPin size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.alamat || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input type={showPassword ? "text" : "password"} readOnly value="**********" className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Map size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.area || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Briefcase size={18} />
                      </div>
                      <input type="text" readOnly value="Sales" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Users size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.supervisor || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#475569] font-medium mb-2">Status</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Info size={18} />
                      </div>
                      <input type="text" readOnly value={selectedSalesData.status || ''} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </MainLayout>

      {/* Popup Detail Sales (Read-Only) */}
      <SalesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="detail"
        data={selectedSales}
      />
    </>
  );
};
