import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Download, Filter, Eye, Users, User, CheckCircle2, XCircle, LayoutDashboard, Target, Banknote, UserCheck } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { KpiCard } from '../../components/common/KpiCard';
import { DataTable } from '../../components/common/DataTable';
import { SupervisorModal } from '../../components/ui/SupervisorModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export const DistributorSupervisorPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-31');
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);

  // Dynamic states
  const [supervisorsList, setSupervisorsList] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<string[]>(['Semua Area']);
  const [supervisorOptions, setSupervisorOptions] = useState<string[]>(['Semua Supervisor']);

  const loadData = async () => {
    if (!user) return;
    try {
      const myArea = user.area || '';
      const res = await api.get('/users?role=supervisor');
      const allSupervisors = res.data.data;

      // Map regional area to supervisor cities
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

      // Filter supervisors
      const filtered = allSupervisors.filter((s: any) => s.area && areaCities.includes(s.area.toLowerCase()));
      setSupervisorsList(filtered);

      // Populate filters
      const uniqueAreas = Array.from(new Set(filtered.map((s: any) => s.area).filter(Boolean))) as string[];
      setAreaOptions(['Semua Area', ...uniqueAreas]);
      setSupervisorOptions(['Semua Supervisor', ...filtered.map((s: any) => s.namaSupervisor)]);

      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Load targets performance summary
      const perfParams: any = { tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir };
      if (area !== 'Semua Area') {
        perfParams.area = area;
      }
      if (supervisor !== 'Semua Supervisor') {
        perfParams.supervisor = supervisor;
      }
      const targetPerfRes = await api.get('/targets/performance', { params: perfParams });
      const targetPerf = targetPerfRes.data;

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan Supervisor',
          value: targetPerf.realisasi || 'Rp 0 Jt',
          description: 'Total realisasi penjualan supervisor',
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Pencapaian Target Supervisor',
          value: `${targetPerf.percentage || 0}%`,
          description: 'Persentase pencapaian target',
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
          progress: targetPerf.percentage > 100 ? 100 : (targetPerf.percentage || 0),
        },
        {
          id: 3,
          title: 'Total Supervisor',
          value: `${filtered.length} Supervisor`,
          description: 'Total supervisor di regional Anda',
          icon: UserCheck,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        }
      ]);
    } catch (err) {
      console.error('Failed to load supervisors list:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const ActionButtons = (
    <button className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
      <Download size={18} />
      Export Data
    </button>
  );

  const tableColumns = [
    { key: 'namaSupervisor', label: 'Supervisor' },
    { key: 'email', label: 'Email' },
    { key: 'nomorHp', label: 'Nomor HP' },
    { key: 'area', label: 'Area' },
    { key: 'jumlahSales', label: 'Jumlah Sales' },
    { key: 'status', label: 'Status' },
    { key: 'detail', label: 'Detail', align: 'center' as const },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSupervisor':
        return <span className="text-gray-700 font-medium">{item.namaSupervisor}</span>;
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
              setSelectedSupervisor(item);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#3b0764] transition-colors w-full cursor-pointer"
          >
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const distributorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
    { name: 'Supervisor', icon: User, path: '/distributor-dashboard/supervisor' },
    { name: 'Sales', icon: Users, path: '/distributor-dashboard/sales' },
    { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
    { name: 'Target Sales', icon: Target, path: '/distributor-dashboard/target-sales' },
  ];

  const filteredSupervisors = supervisorsList.filter((s: any) => {
    if (area !== 'Semua Area' && s.area !== area) return false;
    if (supervisor !== 'Semua Supervisor' && s.namaSupervisor !== supervisor) return false;
    return true;
  });

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

            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={areaOptions} 
              />
            </div>
            
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={supervisorOptions} 
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

        {/* Table */}
        <DataTable
          title="Tabel Supervisor"
          columns={tableColumns}
          data={filteredSupervisors}
          renderCell={renderTableCell}
        />

      </div>

      <SupervisorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="detail"
        data={selectedSupervisor}
      />
    </MainLayout>
  );
};
