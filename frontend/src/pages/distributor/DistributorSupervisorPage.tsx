import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Eye } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import { distributorSupervisorKpiData, distributorSupervisorTableData } from '../../mock/distributorSupervisor';
import { distributorMenuItems } from '../../mock/distributorDashboard';
import clsx from 'clsx';

export const DistributorSupervisorPage = () => {
  const [periodeAwal, setPeriodeAwal] = useState('01 Juli 2026');
  const [periodeAkhir, setPeriodeAkhir] = useState('30 Juni 2026');
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  const ActionButtons = (
    <button className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
      <Download size={18} />
      Export Data
    </button>
  );

  const tableColumns = [
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'jumlahSales', label: 'Jumlah Sales' },
    { key: 'totalPenjualan', label: 'Total Penjualan' },
    { key: 'detail', label: 'Detail', align: 'center' as const },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'detail':
        return (
          <button 
            onClick={() => {
              setSelectedSupervisor({
                namaSupervisor: item.supervisor,
                area: item.area,
                email: item.email,
                nomorHp: item.nomorHp,
                jumlahSales: `${item.jumlahSales} Sales`,
                totalPenjualan: item.totalPenjualan,
                role: 'Supervisor'
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors w-full"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <MainLayout sidebarItems={distributorMenuItems}>
      <Topbar title="Supervisor" subtitle="Pantau performa supervisor pada area distribusi yang dikelola." actionButton={ActionButtons} />

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
                    options={['30 Juni 2026', '01 Juli 2026', '02 Juli 2026']} 
                    showSearch={true}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={['Semua Area', 'Bandung', 'Cirebon', 'Kuningan']} 
                showSearch={true}
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={['Semua Supervisor', 'Didi', 'Rafael', 'Julio']} 
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

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {distributorSupervisorKpiData.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Tabel Supervisor */}
        <DataTable 
          title="Tabel Supervisor"
          columns={tableColumns}
          data={distributorSupervisorTableData}
          renderCell={renderTableCell}
        />

      </div>

      <SupervisorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="view_only"
        data={selectedSupervisor}
      />
    </MainLayout>
  );
};
