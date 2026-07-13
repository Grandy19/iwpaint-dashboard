import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomSelect } from '../ui/CustomSelect';
import { ChevronsLeft, ChevronsRight, Plus, Minus } from 'lucide-react';

const generateDailyData = () => {
  const result = [];
  let currentVal = 50000000;
  for (let i = 1; i <= 30; i++) {
    const change = (Math.random() - 0.45) * 20000000;
    currentVal = Math.max(20000000, Math.min(100000000, currentVal + change));
    result.push({
      name: `${String(i).padStart(2, '0')}/07/2026`,
      value: Math.round(currentVal)
    });
  }
  return result;
};

const dataHari = generateDailyData();

const dataMinggu = Array.from({ length: 12 }, (_, i) => ({
  name: `Minggu ${i + 1}`,
  value: Math.floor(Math.random() * 300000000) + 300000000
}));

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const dataBulan = months.map(m => ({
  name: m,
  value: Math.floor(Math.random() * 1000000000) + 1000000000
}));

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const formattedValue = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(payload[0].value);
    
    return (
      <div className="bg-white px-5 py-3 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-gray-50 flex flex-col items-center">
        <p className="text-[#334155] text-sm font-bold mb-1">{payload[0].payload.name}</p>
        <p className="text-[#94a3b8] text-xs">{formattedValue}</p>
      </div>
    );
  }
  return null;
};

const CustomTick = (props: any) => {
  const { x, y, payload, index, visibleCount } = props;
  
  let showText = true;
  if (visibleCount > 20) {
    showText = index % 3 === 0;
  } else if (visibleCount > 12) {
    showText = index % 2 === 0;
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={-10} r={2.5} stroke="#cbd5e1" strokeWidth={2} fill="white" />
      {showText && (
        <text x={0} y={15} textAnchor="middle" fill="#94a3b8" fontSize={10} fontWeight={500}>
          {payload.value}
        </text>
      )}
    </g>
  );
};

export const TrendLineChart = () => {
  const [periode, setPeriode] = useState('Hari');
  const [page, setPage] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(1);
  const zoomLevels = [7, 12, 15, 30]; // Number of items per page
  
  // Reset page when period or zoom changes
  useEffect(() => {
    setPage(0);
  }, [periode, zoomIndex]);
  
  let currentData = dataHari;
  if (periode === 'Minggu') currentData = dataMinggu;
  else if (periode === 'Bulan') currentData = dataBulan;
  
  const itemsPerPage = zoomLevels[zoomIndex];
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  
  const maxValue = Math.max(...currentData.map(d => d.value));
  const domainMax = maxValue * 1.2; 

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  
  const handleZoomIn = () => {
    if (zoomIndex > 0) setZoomIndex(zoomIndex - 1);
  };

  const handleZoomOut = () => {
    if (zoomIndex < zoomLevels.length - 1) setZoomIndex(zoomIndex + 1);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-900 text-lg">Tren Penjualan</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleZoomOut}
            disabled={zoomIndex === zoomLevels.length - 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
              ${zoomIndex === zoomLevels.length - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#e2e8f0] text-gray-600 hover:bg-gray-300'}`}
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={handleZoomIn}
            disabled={zoomIndex === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors mr-2
              ${zoomIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#e2e8f0] text-gray-600 hover:bg-gray-300'}`}
          >
            <Plus size={16} />
          </button>
          <div className="w-32">
            <CustomSelect 
              value={periode} 
              onChange={setPeriode} 
              options={['Hari', 'Minggu', 'Bulan']} 
            />
          </div>
        </div>
      </div>
      
      <div className="w-full relative pb-4">
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={paginatedData}
              margin={{ top: 40, right: 40, left: 40, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={<CustomTick visibleCount={paginatedData.length} />}
                dy={10}
                interval={0}
              />
              <YAxis hide domain={[0, domainMax]} />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area 
                type="linear" 
                dataKey="value" 
                stroke="#38bdf8" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={{ r: 4, fill: '#fff', stroke: '#38bdf8', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#fff', stroke: '#38bdf8', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center items-center gap-4 mt-6">
          <button 
            onClick={handlePrev}
            disabled={page === 0}
            className={`px-4 py-1.5 border border-gray-300 rounded-lg flex items-center justify-center transition-colors
              ${page === 0 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-[#38bdf8] hover:bg-[#f0f9ff]'}`}
          >
            <ChevronsLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            disabled={page >= totalPages - 1 || totalPages <= 1}
            className={`px-4 py-1.5 border border-gray-300 rounded-lg flex items-center justify-center transition-colors
              ${(page >= totalPages - 1 || totalPages <= 1) ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-[#38bdf8] hover:bg-[#f0f9ff]'}`}
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
