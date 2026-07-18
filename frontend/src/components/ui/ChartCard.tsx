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

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={3.5} stroke="#cbd5e1" strokeWidth={2} fill="white" />
      <text x={0} y={0} dy={20} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={500}>
        {payload.value}
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
       displayLabel = `${parts[0]} ${months[parseInt(parts[1])-1]}`;
    }

    const val = payload[0].value;
    let formattedVal = `Rp ${val.toLocaleString('id-ID')}`;
    if (val >= 1000000) {
      formattedVal = `Rp ${(val / 1000000).toLocaleString('id-ID')} Jt`;
    } else if (val < 100000) {
      formattedVal = val.toLocaleString('id-ID');
    }

    return (
      <div className="bg-white px-4 py-2.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.08)] relative z-50 min-w-[130px] w-auto whitespace-nowrap">
        <div className="text-[#475569] text-[13px] font-medium mb-1">{displayLabel}</div>
        <div className="text-[#38bdf8] text-[14px] font-bold">{formattedVal}</div>
      </div>
    );
  }
  return null;
};

export const ChartCard: React.FC<ChartCardProps> = ({
  data,
  jenisData,
  setJenisData,
  periode,
  setPeriode,
  title = "Tren Penjualan",
  filterAktifLabel
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(0);
  }, [data, periode, jenisData, itemsPerPage]);

  const handlePrev = () => setCurrentPage(p => Math.max(0, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

  const displayData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      {/* Header & Filter */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-gray-600 text-[18px] font-medium">{title}</h3>
        <div className="flex items-center gap-4">
          {filterAktifLabel && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[14px]">Filter Aktif:</span>
              <span className="bg-[#e0f2fe] text-[#0ea5e9] px-3 py-1.5 rounded-lg text-[13px] font-medium">
                {filterAktifLabel}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-[140px]">
            <CustomSelect 
              value={jenisData} 
              onChange={setJenisData} 
              options={['Total Penjualan', 'Total Qty']} 
              triggerClassName="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
              showSearch={false}
            />
          </div>
          <div className="w-[120px]">
            <CustomSelect 
              value={periode} 
              onChange={setPeriode} 
              options={['Hari', 'Bulan', 'Tahun']} 
              triggerClassName="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer focus-within:ring-1 focus-within:ring-[#3b0764] focus-within:border-[#3b0764] transition-colors"
              showSearch={false}
            />
          </div>
        </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 40, left: 40, bottom: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={true} horizontal={false} stroke="#f1f5f9" strokeWidth={1.5} />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={<CustomTick />}
              scale="point"
              interval={0}
              dy={10}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: 'transparent' }} // hides the default line if any
            />
            <Area 
              type="linear" 
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, fill: '#0ea5e9', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-center mt-6 relative">
        <div className="w-24"></div> {/* spacer to center pagination */}
        
        {/* Pagination Controls */}
        {totalPages > 1 ? (
          <div className="flex justify-center items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`p-1 border rounded-md transition-colors ${
                currentPage === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-gray-200 text-gray-500 hover:text-[#0ea5e9] hover:border-[#0ea5e9]'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={`p-1 border rounded-md transition-colors ${
                currentPage === totalPages - 1 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-[#0ea5e9] text-[#0ea5e9] hover:bg-blue-50'
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
            onClick={() => setItemsPerPage(p => Math.min(data.length, p + 5))}
            disabled={itemsPerPage >= data.length}
            className={`w-7 h-7 flex justify-center items-center rounded-full border transition-colors ${
              itemsPerPage >= data.length
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
            title="Zoom Out"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => setItemsPerPage(p => Math.max(5, p - 5))}
            disabled={itemsPerPage <= 5}
            className={`w-7 h-7 flex justify-center items-center rounded-full border transition-colors ${
              itemsPerPage <= 5
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
            title="Zoom In"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
