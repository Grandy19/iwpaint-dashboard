import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomSelect } from './CustomSelect';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

interface ChartCardProps {
  data: any[];
  jenisData: string;
  setJenisData: (val: string) => void;
  periode: string;
  setPeriode: (val: string) => void;
  title?: string;
  filterAktifLabel?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  data,
  jenisData,
  setJenisData,
  periode,
  setPeriode,
  title = "Tren Penjualan",
  filterAktifLabel
}) => {
  const getDefaultItemsPerPage = (per: string) => {
    if (per === 'Hari') return 14;
    if (per === 'Bulan') return 12;
    return 10;
  };

  const [currentPage, setCurrentPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(() => getDefaultItemsPerPage(periode));

  React.useEffect(() => {
    setItemsPerPage(getDefaultItemsPerPage(periode));
    setCurrentPage(0);
  }, [periode]);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [data, jenisData]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const displayData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const calculateInterval = (count: number) => {
    if (count <= 12) return 0;
    if (count <= 20) return 1;
    if (count <= 35) return 2;
    if (count <= 60) return 4;
    return Math.ceil(count / 10);
  };

  const formatXAxisLabel = (val: string) => {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('/')) {
      const parts = val.split('/');
      if (parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
    }
    return val;
  };

  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    const isCrowded = displayData.length > 18;
    return (
      <g transform={`translate(${x},${y})`}>
        {!isCrowded && <circle cx={0} cy={0} r={2.5} stroke="#94a3b8" strokeWidth={1.5} fill="#ffffff" />}
        <text 
          x={0} 
          y={0} 
          dy={!isCrowded ? 18 : 14} 
          textAnchor="middle" 
          fill="#64748b" 
          fontSize={11} 
          fontWeight={500}
        >
          {formatXAxisLabel(payload.value)}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      let displayLabel = label;
      if (label && typeof label === 'string' && label.includes('/')) {
         const parts = label.split('/');
         const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
         const monthName = months[parseInt(parts[1], 10) - 1] || parts[1];
         const year = parts[2] ? ` ${parts[2]}` : '';
         displayLabel = `${parts[0]} ${monthName}${year}`;
      }

      const val = Number(payload[0].value) || 0;
      let formattedVal = '';
      if (jenisData === 'Total Qty') {
        formattedVal = `${val.toLocaleString('id-ID')} Qty`;
      } else {
        if (val >= 1e9) {
          formattedVal = `Rp ${(val / 1e9).toFixed(1).replace(/\.0$/, '').replace('.', ',')} M`;
        } else if (val >= 1e6) {
          formattedVal = `Rp ${(val / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Jt`;
        } else if (val >= 1e3) {
          formattedVal = `Rp ${(val / 1e3).toFixed(1).replace(/\.0$/, '').replace('.', ',')} Rb`;
        } else {
          formattedVal = `Rp ${val.toLocaleString('id-ID')}`;
        }
      }

      return (
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-[0_6px_20px_rgba(0,0,0,0.1)] border border-gray-100 relative z-50 min-w-[130px] w-auto whitespace-nowrap pointer-events-none">
          <div className="text-[#64748b] text-[12px] font-medium mb-1">{displayLabel}</div>
          <div className="text-[#0284c7] text-[15px] font-bold">{formattedVal}</div>
        </div>
      );
    }
    return null;
  };

  const formatYAxisTick = (val: number) => {
    if (val === 0) return '0';
    if (jenisData === 'Total Qty') {
      if (val >= 1e6) return `${(val / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
      return `${val}`;
    }
    if (val >= 1e9) return `${(val / 1e9).toFixed(1).replace(/\.0$/, '').replace('.', ',')}M`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(1).replace(/\.0$/, '').replace('.', ',')}Jt`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(1).replace(/\.0$/, '').replace('.', ',')}Rb`;
    return `${val}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      {/* Header & Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h3 className="text-gray-700 text-[18px] font-semibold tracking-tight">{title}</h3>
        <div className="flex flex-wrap items-center gap-3">
          {filterAktifLabel && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[13px]">Filter:</span>
              <span className="bg-[#e0f2fe] text-[#0284c7] px-3 py-1.5 rounded-lg text-[12px] font-semibold">
                {filterAktifLabel}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-[145px]">
              <CustomSelect 
                value={jenisData} 
                onChange={setJenisData} 
                options={['Total Penjualan', 'Total Qty']} 
                triggerClassName="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>
            <div className="w-[110px]">
              <CustomSelect 
                value={periode} 
                onChange={setPeriode} 
                options={['Hari', 'Bulan', 'Tahun']} 
                triggerClassName="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 cursor-pointer hover:border-gray-300 focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
                showSearch={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[300px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 15, right: 25, left: 10, bottom: 15 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              tick={<CustomTick />}
              scale="point"
              interval={calculateInterval(displayData.length)}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={formatYAxisTick}
              width={55}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#0ea5e9', strokeWidth: 1.5, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#0284c7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              dot={displayData.length <= 18 ? { r: 3.5, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 } : false}
              activeDot={{ r: 6, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-50 relative">
        <div className="w-24"></div> {/* spacer to center pagination */}
        
        {/* Pagination Controls */}
        {totalPages > 1 ? (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`p-1.5 border rounded-lg transition-colors ${
                currentPage === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-200 text-gray-600 hover:text-[#0284c7] hover:border-[#0284c7] bg-white'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-gray-500 font-medium">
              {currentPage + 1} / {totalPages}
            </span>
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={`p-1.5 border rounded-lg transition-colors ${
                currentPage === totalPages - 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-200 text-gray-600 hover:text-[#0284c7] hover:border-[#0284c7] bg-white'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="w-[68px]"></div>
        )}

        {/* Zoom Controls */}
        <div className="flex justify-end items-center gap-2 w-24">
          <button 
            onClick={() => setItemsPerPage(p => Math.min(data.length, p + 7))}
            disabled={itemsPerPage >= data.length}
            className={`w-7 h-7 flex justify-center items-center rounded-lg border transition-colors ${
              itemsPerPage >= data.length
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white'
            }`}
            title="Zoom Out (Tampilkan Lebih Banyak)"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setItemsPerPage(p => Math.max(7, p - 7))}
            disabled={itemsPerPage <= 7}
            className={`w-7 h-7 flex justify-center items-center rounded-lg border transition-colors ${
              itemsPerPage <= 7
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white'
            }`}
            title="Zoom In (Tampilkan Lebih Sedikit)"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
