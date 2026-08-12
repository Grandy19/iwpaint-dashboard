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
import { ExportModal } from '../../components/ui/ExportModal';

export const DistributorSupervisorPage = () => {
  const { user } = useAuth();
  const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');
  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-30');
  const [area, setArea] = useState('Semua Area');
  const [supervisor, setSupervisor] = useState('Semua Supervisor');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
          title: 'Total Penjualan (RP)',
          value: targetPerf.realisasi || 'Rp 0 Jt',
          description: 'Total realisasi penjualan supervisor',
          icon: Banknote,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Pencapaian Target (%)',
          value: `${Math.min(targetPerf.percentage || 0, 100)}%`,
          description: 'Persentase pencapaian target',
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
          progress: targetPerf.percentage > 100 ? 100 : (Math.min(targetPerf.percentage || 0, 100)),
        },
        {
          id: 3,
          title: 'Total Supervisor',
          value: `${filtered.length} Supervisor`,
          description: 'Total supervisor di regional Anda',
          icon: UserCheck,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);
    } catch (err) {
      console.error('Failed to load supervisors list:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, periodeAwal, periodeAkhir, area, supervisor]);

  const ActionButtons = (
    <button 
      onClick={() => setIsExportModalOpen(true)}
      className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
    >
      <Download size={18} />
      Export Data
    </button>
  );

  const tableColumns = [
    { key: 'namaSupervisor', label: 'Supervisor', className: 'w-[20%]' },
    { key: 'email', label: 'Email', className: 'w-[22%]' },
    { key: 'nomorHp', label: 'Nomor HP', className: 'w-[15%]' },
    { key: 'area', label: 'Area', className: 'w-[12%]' },
    { key: 'jumlahSales', label: 'Jumlah Sales', align: 'center', className: 'w-[12%]' },
    { key: 'status', label: 'Status', align: 'center', className: 'w-[10%]' },
    { key: 'detail', label: 'Detail', align: 'center', className: 'w-[9%]' },
  ];

  const renderTableCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSupervisor':
        return <span className="text-gray-700 font-medium">{item.namaSupervisor}</span>;
      case 'status':
        return item.status === 'Aktif' ? (
          <span className="flex items-center justify-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Aktif
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 text-[#ef4444] font-medium">
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
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer shadow-sm border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 whitespace-nowrap">
            <Eye size={16} /> Detail
          </button>
        );
      default:
        return item[columnKey];
    }
  };

    const distributorMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
    { name: 'Sales', icon: User, path: '/distributor-dashboard/sales' },
    { name: 'Supervisor', icon: UserCheck, path: '/distributor-dashboard/supervisor' },
    { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
    { name: 'Target Penjualan', icon: Target, path: '/distributor-dashboard/target-sales' },
  ];

  const filteredSupervisors = supervisorsList.filter((s: any) => {
    if (area !== 'Semua Area' && s.area !== area) return false;
    if (supervisor !== 'Semua Supervisor' && s.namaSupervisor !== supervisor) return false;
    return true;
  });

  const absensiColumns = [
    { key: 'tanggal', label: 'Tanggal', className: 'w-[13%]' },
    { key: 'namaSupervisor', label: 'Nama Supervisor', className: 'w-[20%]' },
    { key: 'area', label: 'Area', className: 'w-[13%]' },
    { key: 'loginPagi', label: 'Login Pagi', className: 'w-[13%]' },
    { key: 'loginSore', label: 'Login Sore', className: 'w-[13%]' },
    { key: 'aktivitasTerakhir', label: 'Aktivitas Terakhir', className: 'w-[14%]' },
    { key: 'totalLoginHariIni', label: 'Total Login Hari Ini', align: 'center', className: 'w-[14%]' },
  ];

  const renderAbsensiCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'namaSupervisor':
        return <span className="text-gray-700 font-medium whitespace-nowrap">{item.namaSupervisor}</span>;
      case 'totalLoginHariIni': {
        const idLen = item.id ? String(item.id).length : 5;
        const nameLen = (item.namaSupervisor || '').length || 10;
        const total = 1 + ((idLen + nameLen) % 4);
        return <span className="whitespace-nowrap flex items-center justify-center">{total}x</span>;
      }
      default:
        return <span className="whitespace-nowrap">{item[columnKey]}</span>;
    }
  };

  const dummyAbsensiData = filteredSupervisors.map((s: any, idx: number) => {
    const isHadir = idx % 3 !== 2;
    const isTerlambat = idx % 4 === 1;
    let status = isHadir ? 'Hadir' : 'Tidak Hadir';
    if (isHadir && isTerlambat) status = 'Terlambat';
    const isCentang = idx === 2;

    return {
      ...s,
      tanggal: '12 Agu 2026',
      loginPagi: status === 'Tidak Hadir' ? '-' : (isCentang ? '✓' : (status === 'Terlambat' ? '08:21' : '07:58')),
      loginSore: status === 'Tidak Hadir' ? '-' : (isCentang ? '✓' : (status === 'Terlambat' ? '-' : '16:42')),
      status,
      aktivitasTerakhir: status === 'Tidak Hadir' ? '-' : (isCentang ? '17:02' : (status === 'Terlambat' ? '08:24' : '16:45')),
    };
  });

  return (
    <>
      <MainLayout sidebarItems={distributorMenuItems}>
        <Topbar title="Supervisor" subtitle="Pantau performa supervisor pada area distribusi yang dikelola." actionButton={ActionButtons} />

      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-6 items-end">
            <div className="w-full lg:w-[400px] flex-none">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Periode</label>
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAwal} 
                    onChange={(e) => setPeriodeAwal(e.target.value)} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={periodeAkhir} 
                    onChange={(e) => setPeriodeAkhir(e.target.value)} 
                    className="w-full px-4 py-2 h-[42px] text-sm bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Modern Divider */}
            <div className="hidden lg:block w-[2px] h-[32px] bg-slate-200 rounded-full mb-[5px]"></div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={areaOptions} 
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2 whitespace-nowrap">Supervisor</label>
              <CustomSelect 
                value={supervisor} 
                onChange={setSupervisor} 
                options={supervisorOptions} 
                showSearch={true}
              />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>

        {/* Tables */}
        <div className="flex flex-col">
          <DataTable tableLayout="auto"
            title="Daftar Supervisor"
            columns={tableColumns}
            data={filteredSupervisors}
            renderCell={renderTableCell}
          />
          <DataTable tableLayout="auto"
            title="Riwayat Absensi Supervisor"
            columns={absensiColumns}
            data={dummyAbsensiData}
            renderCell={renderAbsensiCell}
          />
        </div>

      </div>

      <SupervisorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="view_only"
        data={selectedSupervisor}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fileName="supervisor-distributor.pdf"
      />
      </MainLayout>
    </>
  );
};
