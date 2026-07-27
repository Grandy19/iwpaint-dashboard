import { Target, Wallet, TrendingUp, UserCheck, PaintRoller, Wrench, Factory } from 'lucide-react';

export const supervisorTargetKpiData = [
  {
    id: 1,
    title: 'Target Penjualan Tim',
    value: 'Rp 250 Jt',
    description: 'Total target penjualan seluruh tim',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Realisasi Penjualan Tim',
    value: 'Rp 200 Jt',
    description: 'Total realisasi penjualan seluruh tim',
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Pencapaian Target Tim',
    value: '83%',
    description: 'Persentase pencapaian target seluruh tim',
    icon: TrendingUp,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 83,
  },
  {
    id: 4,
    title: 'Sales Mencapai Target',
    value: '8 / 12 Sales',
    description: 'Jumlah sales yang telah mencapai target',
    icon: UserCheck,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const supervisorTargetRingkasanData = {
  percentage: 80,
  targetGlobal: 'Rp 250 Jt',
  realisasi: 'Rp 200 Jt',
  selisih: 'Rp 50 Jt'
};

export const supervisorTargetRealisasiData = [
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
  }
];

export const supervisorTargetPerformanceData = [
  { id: 1, sales: 'Heri', area: 'Bandung', supervisor: 'Andi', target: 'Rp 200 Jt', realisasi: 'Rp 160 Jt', pencapaian: '80%', status: 'Belum Tercapai', totalCustomer: '120', totalQty: '400 Kg', totalTransaksi: '500' },
  { id: 2, sales: 'Fransiskus', area: 'Jakarta', supervisor: 'Andi', target: 'Rp 180 Jt', realisasi: 'Rp 180 Jt', pencapaian: '100%', status: 'Tercapai', totalCustomer: '90', totalQty: '350 Kg', totalTransaksi: '400' },
  { id: 3, sales: 'Budi', area: 'Cirebon', supervisor: 'Andi', target: 'Rp 180 Jt', realisasi: 'Rp 180 Jt', pencapaian: '100%', status: 'Tercapai', totalCustomer: '85', totalQty: '340 Kg', totalTransaksi: '390' },
  { id: 4, sales: 'Rudi', area: 'Kuningan', supervisor: 'Andi', target: 'Rp 300 Jt', realisasi: 'Rp 290 Jt', pencapaian: '96%', status: 'Belum Tercapai', totalCustomer: '150', totalQty: '600 Kg', totalTransaksi: '700' },
  { id: 5, sales: 'Dadang', area: 'Bandung', supervisor: 'Andi', target: 'Rp 140 Jt', realisasi: 'Rp 140 Jt', pencapaian: '100%', status: 'Tercapai', totalCustomer: '70', totalQty: '250 Kg', totalTransaksi: '300' }
];

export const supervisorTargetHistoryData = [
  { id: 1, periode: 'Juli 2026', target: 'Rp 250 Jt', realisasi: 'Rp 200 Jt', pencapaian: '80%', status: 'Belum Tercapai' },
  { id: 2, periode: 'Juni 2026', target: 'Rp 220 Jt', realisasi: 'Rp 220 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 3, periode: 'Mei 2026', target: 'Rp 220 Jt', realisasi: 'Rp 220 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 4, periode: 'April 2026', target: 'Rp 300 Jt', realisasi: 'Rp 290 Jt', pencapaian: '96%', status: 'Belum Tercapai' },
  { id: 5, periode: 'Maret 2026', target: 'Rp 200 Jt', realisasi: 'Rp 200 Jt', pencapaian: '100%', status: 'Tercapai' },
];
