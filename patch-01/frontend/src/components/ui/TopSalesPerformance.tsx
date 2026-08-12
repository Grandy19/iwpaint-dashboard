import React, { useState, useEffect } from 'react';
import { Trophy, Crown } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const formatJuta = (angka: number) => {
  return `Rp ${(angka / 1000000).toFixed(0)} Jt`;
};

interface TopSalesPerformanceProps {
  periodeAwal?: string;
  periodeAkhir?: string;
  kategoriProduk?: string;
}

export const TopSalesPerformance: React.FC<TopSalesPerformanceProps> = ({
  periodeAwal = '2026-01-01',
  periodeAkhir = '2026-12-31',
  kategoriProduk = 'Semua Kategori'
}) => {
  const { user } = useAuth();
  const [topSalesData, setTopSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // Selalu gunakan bulan saat ini terlepas dari periode yang difilter
        const dateObj = new Date(); // Current date instead of periodeAwal
        const targetYear = dateObj.getFullYear() || 2026;
        const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

        const targetRes = await api.get('/targets', { 
          params: { 
            salesman: 'Semua Sales', 
            tahun: targetYear, 
            bulan_nama: targetMonthName
            // Tidak mengirim periodeAwal & periodeAkhir agar backend menggunakan bulan_nama
          } 
        });

        const rawData = targetRes.data.data || [];
        
        // Selalu hitung dari semua kategori, abaikan kategoriProduk
        const mappedData = rawData.map((s: any) => {
          let totalRealisasi = s.realisasi_deco + s.realisasi_auto + s.realisasi_ind;
          let totalTarget = s.raw_target_deco + s.raw_target_auto + s.raw_target_ind;

          const rawPercentage = totalTarget > 0 ? (totalRealisasi / totalTarget) * 100 : 0;
          const percentage = Math.min(Math.round(rawPercentage), 100);

          return {
            id: s.id,
            name: s.sales,
            area: s.area,
            penjualan: totalRealisasi,
            pencapaian: percentage,
            isMe: user?.name === s.sales,
            initials: s.sales.substring(0, 2).toUpperCase(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.sales)}&background=random&color=fff`
          };
        });

        // Sort by total penjualan descending
        mappedData.sort((a: any, b: any) => b.penjualan - a.penjualan);
        
        // Assign ranks
        const rankedData = mappedData.map((item: any, idx: number) => ({
          ...item,
          rank: idx + 1
        }));

        setTopSalesData(rankedData);
      } catch (error) {
        console.error("Failed to load leaderboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user?.name]); // Hapus dependensi periode & kategori agar hanya mount sekali (current month)

  if (isLoading) {
    return <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[400px] flex items-center justify-center text-slate-500">Memuat Leaderboard...</div>;
  }

  if (topSalesData.length === 0) {
    return <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[400px] flex items-center justify-center text-slate-500">Tidak ada data leaderboard</div>;
  }

  // Handle case where there are fewer than 3 top sales
  const top1 = topSalesData.length > 0 ? topSalesData[0] : null;
  const top2 = topSalesData.length > 1 ? topSalesData[1] : null;
  const top3 = topSalesData.length > 2 ? topSalesData[2] : null;

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
            {top2 ? (
              <div className="flex flex-col items-center w-[28%] max-w-[110px] h-full justify-end relative group">
                <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-full border-2 border-white shadow-md relative mb-2">
                    <img src={top2.avatar} alt="Rank 2" className="w-full h-full rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-slate-700 rounded-full p-1 border border-slate-600">
                      <Crown size={10} className="text-slate-300" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-[13px] truncate w-full text-center" title={top2.name}>{top2.name}</h4>
                  <p className="font-semibold text-slate-500 text-[12px]">{top2.pencapaian}%</p>
                </div>
                {/* Box Podium */}
                <div className="w-full h-[120px] bg-emerald-500 rounded-t-xl flex justify-center pt-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
              </div>
            ) : <div className="w-[28%] max-w-[110px]"></div>}

            {/* Rank 1 */}
            {top1 ? (
              <div className="flex flex-col items-center w-[32%] max-w-[130px] h-full justify-end relative group">
                <div className="absolute top-[20%] opacity-20 w-32 h-32 bg-amber-400 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1 relative z-10">
                  <div className="w-16 h-16 rounded-full border-[3px] border-amber-400 shadow-lg relative mb-2">
                    <img src={top1.avatar} alt="Rank 1" className="w-full h-full rounded-full object-cover" />
                    <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 rounded-full p-1.5 border border-amber-400 shadow-sm">
                      <Crown size={12} className="text-white" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-[14px] truncate w-full text-center" title={top1.name}>{top1.name}</h4>
                  <p className="font-semibold text-slate-500 text-[12px]">{top1.pencapaian}%</p>
                </div>
                {/* Box Podium */}
                <div className="w-full h-[160px] bg-yellow-400 rounded-t-xl flex justify-center pt-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
                  <span className="text-slate-800 font-bold text-2xl">1</span>
                </div>
              </div>
            ) : <div className="w-[32%] max-w-[130px]"></div>}

            {/* Rank 3 */}
            {top3 ? (
              <div className="flex flex-col items-center w-[28%] max-w-[110px] h-full justify-end relative group">
                <div className="flex flex-col items-center mb-3 transition-transform group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-full border-2 border-white shadow-md relative mb-2">
                    <img src={top3.avatar} alt="Rank 3" className="w-full h-full rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-orange-800 rounded-full p-1 border border-orange-700">
                      <Crown size={10} className="text-orange-200" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-[13px] truncate w-full text-center" title={top3.name}>{top3.name}</h4>
                  <p className="font-semibold text-slate-500 text-[12px]">{top3.pencapaian}%</p>
                </div>
                {/* Box Podium */}
                <div className="w-full h-[90px] bg-blue-500 rounded-t-xl flex justify-center pt-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
              </div>
            ) : <div className="w-[28%] max-w-[110px]"></div>}
            
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
