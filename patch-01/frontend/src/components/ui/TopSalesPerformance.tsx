import React from 'react';
import { Trophy, User, ArrowUp, Crown } from 'lucide-react';

// --- MOCK DATA ---
const topSalesData = [
  { id: 1, rank: 1, name: 'Andi', area: 'Bandung', penjualan: 485000000, pencapaian: 112, initials: 'AN', avatar: 'https://ui-avatars.com/api/?name=Andi&background=3b82f6&color=fff' },
  { id: 2, rank: 2, name: 'Budi', area: 'Kuningan', penjualan: 420000000, pencapaian: 104, initials: 'BU', avatar: 'https://ui-avatars.com/api/?name=Budi&background=10b981&color=fff' },
  { id: 3, rank: 3, name: 'Deni', area: 'Tasikmalaya', penjualan: 385000000, pencapaian: 98, initials: 'DE', avatar: 'https://ui-avatars.com/api/?name=Deni&background=f59e0b&color=fff' },
  { id: 4, rank: 4, name: 'Dewi Lestari', area: 'Semarang', penjualan: 350000000, pencapaian: 95, initials: 'DL' },
  { id: 5, rank: 5, name: 'Reza Rahadian', area: 'Medan', penjualan: 320000000, pencapaian: 92, initials: 'RR' },
  { id: 6, rank: 6, name: 'Hendra Setiawan', area: 'Bali', penjualan: 303000000, pencapaian: 88, initials: 'HS' },
  { id: 7, rank: 7, name: 'Grandy', area: 'Bandung', penjualan: 285000000, pencapaian: 82, initials: 'GR', isMe: true },
  { id: 8, rank: 8, name: 'Joko Anwar', area: 'Palembang', penjualan: 250000000, pencapaian: 75, initials: 'JA' },
];

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const formatJuta = (angka: number) => {
  return `Rp ${(angka / 1000000).toFixed(0)} Jt`;
};

export const TopSalesPerformance: React.FC = () => {
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* KIRI - PODIUM & POSISI ANDA (45%) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Header Podium */}
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-slate-500" />
            <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">LEADERBOARD TOP 3 BULAN INI</h3>
          </div>
          
          {/* Podium Graphics (Bar style) */}
          <div className="flex justify-center items-end gap-3 mt-6 px-4 flex-1">
            
            {/* Rank 2 */}
            <div className="flex flex-col items-center w-[28%] max-w-[110px] h-full justify-end relative group">
              <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full border-2 border-white shadow-md relative mb-2">
                  <img src={topSalesData[1].avatar} alt="Rank 2" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-slate-700 rounded-full p-1 border border-slate-600">
                    <Crown size={10} className="text-slate-300" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-[13px] truncate w-full text-center">{topSalesData[1].name}</h4>
                <p className="font-semibold text-slate-500 text-[12px]">{topSalesData[1].pencapaian}%</p>
              </div>
              {/* Box Podium */}
              <div className="w-full h-[120px] bg-emerald-500 rounded-t-xl flex justify-center pt-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                <span className="text-white font-bold text-xl">2</span>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center w-[32%] max-w-[130px] h-full justify-end relative group">
              <div className="absolute top-[20%] opacity-20 w-32 h-32 bg-amber-400 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1 relative z-10">
                <div className="w-16 h-16 rounded-full border-[3px] border-amber-400 shadow-lg relative mb-2">
                  <img src={topSalesData[0].avatar} alt="Rank 1" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 rounded-full p-1.5 border border-amber-400 shadow-sm">
                    <Crown size={12} className="text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-[14px] truncate w-full text-center">{topSalesData[0].name}</h4>
                <p className="font-semibold text-slate-500 text-[12px]">{topSalesData[0].pencapaian}%</p>
              </div>
              {/* Box Podium */}
              <div className="w-full h-[160px] bg-yellow-400 rounded-t-xl flex justify-center pt-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
                <span className="text-slate-800 font-bold text-2xl">1</span>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center w-[28%] max-w-[110px] h-full justify-end relative group">
              <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full border-2 border-white shadow-md relative mb-2">
                  <img src={topSalesData[2].avatar} alt="Rank 3" className="w-full h-full rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-orange-800 rounded-full p-1 border border-orange-700">
                    <Crown size={10} className="text-orange-200" />
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-[13px] truncate w-full text-center">{topSalesData[2].name}</h4>
                <p className="font-semibold text-slate-500 text-[12px]">{topSalesData[2].pencapaian}%</p>
              </div>
              {/* Box Podium */}
              <div className="w-full h-[90px] bg-blue-500 rounded-t-xl flex justify-center pt-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                <span className="text-white font-bold text-xl">3</span>
              </div>
            </div>
            
          </div>

        </div>

        {/* KANAN - TABLE (55%) */}
        <div className="lg:col-span-7 flex flex-col pl-0 lg:pl-6 border-l-0 lg:border-l border-slate-100">
          <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase border-b border-slate-100 pb-3 mb-4">Peringkat Lainnya</h3>
          
          <div className="overflow-hidden rounded-xl border border-slate-100 flex-1 flex flex-col">
            <div className="overflow-y-auto max-h-[300px] custom-scroll">
              <table className="w-full text-left border-collapse relative">
                <thead className="bg-slate-50 sticky top-0 z-10 border-y border-slate-100">
                  <tr>
                    <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[10%]">Rank</th>
                    <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[30%]">Sales</th>
                    <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[20%]">Area</th>
                    <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[20%]">Penjualan</th>
                    <th className="py-4 px-6 text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[20%] text-center">Pencapaian</th>
                  </tr>
                </thead>
                <tbody>
                  {topSalesData.map((sales) => (
                    <tr key={sales.id} className={`border-b border-gray-50 last:border-0 hover:bg-[#f8f6fb] transition-colors duration-200 ${sales.isMe ? 'bg-[#f8f6fb]' : ''}`}>
                      <td className="py-4 px-6">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold ${
                          sales.isMe ? 'bg-indigo-100 text-indigo-700' : 
                          sales.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          sales.rank === 2 ? 'bg-emerald-100 text-emerald-700' :
                          sales.rank === 3 ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {sales.rank}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm ${sales.isMe ? 'font-bold text-indigo-700' : 'text-gray-600'}`}>
                        {sales.name} {sales.isMe && '(Anda)'}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{sales.area}</td>
                      <td className={`py-4 px-6 text-sm ${sales.isMe ? 'font-bold text-indigo-700' : 'text-gray-600'}`}>{formatJuta(sales.penjualan)}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-semibold text-center">
                        {sales.pencapaian}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
