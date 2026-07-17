import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Topbar } from '../../components/layout/Topbar';
import { Upload, Plus, CheckCircle2, XCircle, Edit3, ArrowDown, Filter } from 'lucide-react';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { DataTable } from '../../components/common/DataTable';
import { KpiCard } from '../../components/common/KpiCard';
import { targetSalesKpiData, targetSalesSummary, targetSalesTableData } from '../../mock/targetSales';

export const TargetSalesPage = () => {
  const [startDate, setStartDate] = useState('01 Juli 2026');
  const [endDate, setEndDate] = useState('30 Juni 2026');
  const [area, setArea] = useState('Semua Area');
  const [salesName, setSalesName] = useState('Semua Sales');

  const ActionButtons = (
    <div className="flex items-center gap-4">
      <button className="bg-[#52b788] hover:bg-[#40916c] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Upload size={18} />
        Export Data
      </button>
      <button className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Plus size={18} />
        Input Target
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
        return item.status === 'Sudah Input' ? (
          <button className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
            <Edit3 size={18} strokeWidth={2.5} />
          </button>
        ) : (
          <button className="flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
            <Plus size={18} strokeWidth={2.5} />
          </button>
        );
      default:
        return item[columnKey];
    }
  };

  // Sort data: "Sudah Input" first, then by highest total target
  const sortedTableData = [...targetSalesTableData].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'Sudah Input' ? -1 : 1;
    }
    
    if (a.status === 'Sudah Input') {
      const valA = parseInt(a.totalTarget.replace(/[^0-9]/g, '')) || 0;
      const valB = parseInt(b.totalTarget.replace(/[^0-9]/g, '')) || 0;
      return valB - valA; // Descending
    }
    
    return 0;
  });

  return (
    <MainLayout>
      <Topbar 
        title="Target Sales" 
        subtitle="Terakhir Diperbarui: Hari Ini, 10.45 WIB"
        actionButton={ActionButtons}
      />
      
      <div className="px-8 pb-10">
        
        {/* Filter Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect 
                    value={startDate} 
                    onChange={setStartDate} 
                    options={['01 Juli 2026', '01 Juni 2026']} 
                  />
                </div>
                <span className="text-gray-500 font-bold">-</span>
                <div className="flex-1">
                  <CustomSelect 
                    value={endDate} 
                    onChange={setEndDate} 
                    options={['30 Juni 2026', '31 Juli 2026']} 
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect 
                value={area} 
                onChange={setArea} 
                options={['Semua Area', 'Bandung', 'Jakarta']} 
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect 
                value={salesName} 
                onChange={setSalesName} 
                options={['Semua Sales', 'Heri', 'Fransiskus', 'Rudi', 'Budi', 'Santoso']} 
              />
            </div>

            <div className="col-span-1 flex items-end">
              <button className="w-full bg-[#3b0764] hover:bg-[#2e054e] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 h-[42px]">
                <Filter size={18} />
                Terapkan
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid for KPI & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* KPI Cards (2x2 grid) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {targetSalesKpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Global Target Summary Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-6">Ringkasan Target Global</h3>
            
            <div className="flex-1 flex flex-col justify-center">
              {/* Simple Donut Chart SVG */}
              <div className="relative w-40 h-40 mx-auto mb-8">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e0f2fe" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="12" strokeDasharray={`${targetSalesSummary.percentage * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-[#0ea5e9]">{targetSalesSummary.percentage}%</span>
                  <span className="text-xs text-gray-500 font-medium">Tercapai</span>
                </div>
              </div>

              {/* Stats List */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#e0f2fe]"></div>
                    <span className="text-gray-500">Target Global</span>
                  </div>
                  <span className="font-semibold text-gray-800">{targetSalesSummary.targetGlobal}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                    <span className="text-gray-500">Realisasi</span>
                  </div>
                  <span className="font-semibold text-gray-800">{targetSalesSummary.realisasi}</span>
                </div>

                <div className="flex justify-between items-center text-sm bg-[#fee2e2] px-3 py-2 rounded-lg mt-1">
                  <div className="flex items-center gap-2 text-[#ef4444]">
                    <ArrowDown size={14} />
                    <span className="font-medium">Selisih</span>
                  </div>
                  <span className="font-bold text-[#ef4444]">{targetSalesSummary.selisih}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <DataTable
          title="Tabel Target Sales"
          columns={tableColumns}
          data={sortedTableData}
          renderCell={renderCell}
        />
      </div>
    </MainLayout>
  );
};
