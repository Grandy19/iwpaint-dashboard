import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Plus, CheckCircle2, XCircle, Edit3, ArrowDown, Filter, Wallet, Target, CreditCard, Users, PaintRoller, Wrench, Factory } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { TargetSalesModal } from '../../components/ui/TargetSalesModal';
import { TargetRealisasiCard } from '../../components/ui/TargetRealisasiCard';
import { ExportModal } from '../../components/ui/ExportModal';
import api from '../../utils/api';

export const TargetSalesPage = () => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [area, setArea] = useState('Semua Area');
  const [salesName, setSalesName] = useState('Semua Sales');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Dynamic state
  const [targetsList, setTargetsList] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });
  const [detailTargetRealisasi, setDetailTargetRealisasi] = useState<any[]>([]);

  const [areaOptions, setAreaOptions] = useState<string[]>(['Semua Area']);
  const [salesOptions, setSalesOptions] = useState<string[]>(['Semua Sales']);

  const loadData = async () => {
    try {
      const dateObj = new Date(startDate);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Get targets from backend
      const params: any = { tahun: targetYear, bulan_nama: targetMonthName };
      if (salesName !== 'Semua Sales') params.salesman = salesName;

      const targetRes = await api.get('/targets', { params });
      let allTargets = targetRes.data.data;

      // Filter by Area client-side
      if (area !== 'Semua Area') {
        allTargets = allTargets.filter((t: any) => t.area === area);
      }
      setTargetsList(allTargets);

      // Populate unique area options & sales options
      const areas = Array.from(new Set(allTargets.map((t: any) => t.area).filter(Boolean))) as string[];
      setAreaOptions(['Semua Area', ...areas]);
      
      const salesUsersRes = await api.get('/users?role=sales');
      setSalesOptions(['Semua Sales', ...salesUsersRes.data.data.map((u: any) => u.namaSales)]);

      // Load performance summary
      const perfParams: any = { tahun: targetYear, bulan_nama: targetMonthName };
      if (salesName !== 'Semua Sales') perfParams.salesman = salesName;
      if (area !== 'Semua Area') perfParams.area = area;

      const perfRes = await api.get('/targets/performance', { params: perfParams });
      setSummaryData(perfRes.data);

      const isDetailView = salesName !== 'Semua Sales';
      if (isDetailView) {
        // Find selected sales target details
        const selectedRow = allTargets.find((t: any) => t.sales === salesName);
        if (selectedRow) {
          setDetailTargetRealisasi([
            {
              id: 'decorative',
              title: 'Decorative',
              icon: PaintRoller,
              percentage: selectedRow.raw_target_deco > 0 ? Math.min(Math.round((selectedRow.realisasi_deco / selectedRow.raw_target_deco) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_deco / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_deco / 1e6).toFixed(1)} Jt`
            },
            {
              id: 'automotive',
              title: 'Automotive',
              icon: Wrench,
              percentage: selectedRow.raw_target_auto > 0 ? Math.min(Math.round((selectedRow.realisasi_auto / selectedRow.raw_target_auto) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_auto / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_auto / 1e6).toFixed(1)} Jt`
            },
            {
              id: 'industri',
              title: 'Industri',
              icon: Factory,
              percentage: selectedRow.raw_target_ind > 0 ? Math.min(Math.round((selectedRow.realisasi_ind / selectedRow.raw_target_ind) * 100), 100) : 0,
              realisasi: `Rp ${Number(selectedRow.realisasi_ind / 1e6).toFixed(1)} Jt`,
              target: `Rp ${Number(selectedRow.raw_target_ind / 1e6).toFixed(1)} Jt`
            }
          ]);

          setKpiData([
            {
              id: 1,
              title: 'Total Penjualan (Rp)',
              value: selectedRow.totalRealisasi,
              description: 'Total penjualan pada periode terpilih',
              icon: Wallet,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
              percentageLabel: `${selectedRow.percentage}%`,
            },
            {
              id: 2,
              title: 'Total Target Bulan Ini',
              value: selectedRow.totalTarget,
              description: 'Target untuk bulan Juli 2026',
              icon: Target,
              iconColor: 'text-[#3b82f6]',
              iconBg: 'bg-[#dbeafe]',
            },
            {
              id: 3,
              title: 'Total Customer',
              value: `${selectedRow.status === 'Sudah Input' ? 12 : 0} Customer`, // placeholder/derived
              description: 'Customer yang dilayani',
              icon: Users,
              iconColor: 'text-[#f59e0b]',
              iconBg: 'bg-[#fef3c7]',
            },
            {
              id: 4,
              title: 'Total Transaksi',
              value: `${selectedRow.totalTransaksi} Transaksi`,
              description: 'Periode Juni 2026',
              icon: CreditCard,
              iconColor: 'text-[#10b981]',
              iconBg: 'bg-[#dcfce7]',
            }
          ]);
        }
      } else {
        // Global KPIs
        const totalSalesRes = await api.get('/dashboard/total-sales');
        const totalSalesVal = totalSalesRes.data.total_sales;

        const totalSalesmenCount = salesUsersRes.data.data.length;
        const inputCount = allTargets.filter((t: any) => t.status === 'Sudah Input').length;
        const noInputCount = totalSalesmenCount - inputCount;

        setKpiData([
          {
            id: 1,
            title: 'Total Sales',
            value: `${totalSalesmenCount} Sales`,
            description: 'Total Semua Sales',
            icon: Users,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
          },
          {
            id: 2,
            title: 'Total Target Bulan Ini',
            value: perfRes.data.targetGlobal,
            description: `Total Target ${targetMonthName} ${targetYear}`,
            icon: Target,
            iconColor: 'text-[#3b82f6]',
            iconBg: 'bg-[#dbeafe]',
          },
          {
            id: 3,
            title: 'Sales Sudah Memiliki Target',
            value: `${inputCount} Sales`,
            description: `Target ${targetMonthName} ${targetYear} telah diinput`,
            icon: CheckCircle2,
            iconColor: 'text-[#10b981]',
            iconBg: 'bg-[#dcfce7]',
          },
          {
            id: 4,
            title: 'Sales Belum Memiliki Target',
            value: `${noInputCount} Sales`,
            description: `Target ${targetMonthName} ${targetYear} belum diinput`,
            icon: XCircle,
            iconColor: 'text-[#ef4444]',
            iconBg: 'bg-[#fee2e2]',
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load targets performance:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [salesName, area, startDate, endDate]);

  const isDetailView = salesName !== 'Semua Sales';

  const ActionButtons = (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setIsExportModalOpen(true)}
        className="w-[160px] justify-center bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Upload size={18} />
        Export Data
      </button>
      <button 
        onClick={() => {
          setSelectedTarget(null);
          setModalMode('create');
          setIsModalOpen(true);
        }}
        className="w-[160px] justify-center bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Plus size={18} />
        {isDetailView ? 'Sales' : 'Target'}
      </button>
    </div>
  );

  const tableColumns = [
    { key: 'sales', label: 'Sales' },
    { key: 'area', label: 'Area' },
    { key: 'decorative', label: 'Decorative' },
    { key: 'automotive', label: 'Automotive' },
    { key: 'industri', label: 'Industri' },
    { key: 'totalTarget', label: 'Total Target' },
    { key: 'status', label: 'Status' },
    { key: 'aksi', label: 'Aksi' },
  ];

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return item.status === 'Sudah Input' ? (
          <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
            <CheckCircle2 size={16} /> Sudah Input
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#ef4444] font-medium">
            <XCircle size={16} /> Belum Input
          </span>
        );
      case 'aksi':
        return (
          <button 
            onClick={() => { 
              setSelectedTarget(item); 
              setModalMode('edit'); 
              setIsModalOpen(true); 
            }}
            className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            {item.status === 'Sudah Input' ? <Edit3 size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  const handleSaveModal = async (formData: any) => {
    const parseNum = (val: any) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const clean = String(val).replace(/[^0-9]/g, '');
      return parseInt(clean) || 0;
    };

    try {
      await api.post('/targets', {
        sales: formData.sales,
        decorative: parseNum(formData.decorative),
        automotive: parseNum(formData.automotive),
        industri: parseNum(formData.industri),
        tahun: Number(formData.tahun) || 2026,
        bulan_nama: formData.bulan || 'Juli'
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save targets:', err);
    }
  };

  return (
    <MainLayout>
      <Topbar 
        title={isDetailView ? "Sales" : "Target Sales"}
        subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB"
        actionButton={ActionButtons}
      />
      
      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
                <span className="text-gray-500 font-bold">-</span>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={areaOptions} 
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={salesName} 
                onChange={setSalesName} 
                options={salesOptions} 
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

        {/* Dashboard Grid for KPI & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* KPI Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {kpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Global Target Summary Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-gray-600 text-[18px] font-medium mb-6">{isDetailView ? 'Ringkasan Target' : 'Ringkasan Target Global'}</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e0f2fe" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="12" strokeDasharray={`${summaryData.percentage * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[24px] font-bold text-[#0ea5e9]">{summaryData.percentage}%</span>
                  <span className="text-xs text-gray-500 font-medium mt-1">Tercapai</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#e0f2fe]"></div>
                    <span className="text-gray-500">{isDetailView ? 'Total Target' : 'Target Global'}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{summaryData.targetGlobal}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                    <span className="text-gray-500">Realisasi</span>
                  </div>
                  <span className="font-semibold text-gray-800">{summaryData.realisasi}</span>
                </div>

                <div className="flex justify-between items-center text-sm bg-[#fee2e2] px-3 py-2 rounded-lg mt-1">
                  <div className="flex items-center gap-2 text-[#ef4444]">
                    <ArrowDown size={14} />
                    <span className="font-medium">Selisih</span>
                  </div>
                  <span className="font-bold text-[#ef4444]">{summaryData.selisih}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Content: Table or Detailed View */}
        {isDetailView ? (
          <TargetRealisasiCard 
            data={detailTargetRealisasi} 
            onEdit={() => {
              const row = targetsList.find(s => s.sales === salesName);
              setSelectedTarget(row || { sales: salesName, area: 'Semua Area' });
              setModalMode('edit');
              setIsModalOpen(true);
            }}
          />
        ) : (
          <DataTable
            title="Tabel Target Sales"
            columns={tableColumns}
            data={targetsList}
            renderCell={renderCell}
          />
        )}

        {/* Target Sales Modal (Create/Edit) */}
        <TargetSalesModal 
          isOpen={isModalOpen}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          data={selectedTarget}
          onSave={handleSaveModal}
          salesList={salesOptions.filter((s: string) => s !== 'Semua Sales')}
        />
      </div>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        fileName="Data_Target_Sales.xlsx" 
      />
    </MainLayout>
  );
};
