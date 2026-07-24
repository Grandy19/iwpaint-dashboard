import { Target, Wallet, TrendingUp, Flag, PaintRoller, Wrench, Factory } from 'lucide-react';

export const salesTargetKpiData = [
  {
    id: 1,
    title: 'Target Penjualan',
    value: 'Rp 200 Jt',
    description: 'Target penjualan bulan Juli 2026',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Realisasi Penjualan',
    value: 'Rp 150 Jt',
    description: 'Total penjualan periode aktif',
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Pencapaian Target',
    value: '83%',
    description: 'Persentase terhadap target bulan Juli 2026',
    icon: TrendingUp,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 83, // Special property added to display progress bar
  },
  {
    id: 4,
    title: 'Sisa Target',
    value: 'Rp 50 Jt',
    description: 'Nilai penjualan yang masih harus dicapai',
    icon: Flag,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const salesTargetRingkasanData = {
  percentage: 31,
  targetGlobal: 'Rp 200 Jt',
  realisasi: 'Rp 150 Jt',
  selisih: 'Rp 50 Jt'
};

export const salesTargetRealisasiData = [
  {
    id: '1',
    title: 'Decorative',
    icon: PaintRoller,
    percentage: 80,
    realisasi: '160.000.000',
    target: '200.000.000',
  },
  {
    id: '2',
    title: 'Automotive',
    icon: Wrench,
    percentage: 81,
    realisasi: '65.000.000',
    target: '80.000.000',
  },
  {
    id: '3',
    title: 'Industri',
    icon: Factory,
    percentage: 90,
    realisasi: '45.000.000',
    target: '50.000.000',
  },
];

export const salesTargetHistoryData = [
  { id: 1, periode: 'Juli 2026', target: 'Rp 200 Jt', realisasi: 'Rp 160 Jt', pencapaian: '83%', status: 'Belum Tercapai' },
  { id: 2, periode: 'Juni 2026', target: 'Rp 160 Jt', realisasi: 'Rp 160 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 3, periode: 'Mei 2026', target: 'Rp 160 Jt', realisasi: 'Rp 160 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 4, periode: 'April 2026', target: 'Rp 300 Jt', realisasi: 'Rp 290 Jt', pencapaian: '90%', status: 'Belum Tercapai' },
  { id: 5, periode: 'Maret 2026', target: 'Rp 140 Jt', realisasi: 'Rp 130 Jt', pencapaian: '93%', status: 'Belum Tercapai' },
  { id: 6, periode: 'Februari 2026', target: 'Rp 120 Jt', realisasi: 'Rp 120 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 7, periode: 'Januari 2026', target: 'Rp 150 Jt', realisasi: 'Rp 140 Jt', pencapaian: '93%', status: 'Belum Tercapai' },
  { id: 8, periode: 'Desember 2025', target: 'Rp 180 Jt', realisasi: 'Rp 180 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 9, periode: 'November 2025', target: 'Rp 160 Jt', realisasi: 'Rp 150 Jt', pencapaian: '94%', status: 'Belum Tercapai' },
  { id: 10, periode: 'Oktober 2025', target: 'Rp 150 Jt', realisasi: 'Rp 155 Jt', pencapaian: '103%', status: 'Tercapai' },
];
