import { Wallet, Package, Receipt, Users, PaintRoller, Wrench, Factory, Banknote } from 'lucide-react';

export const salesDashboardKpiData = [
  {
    id: 1,
    title: 'Total Penjualan (Rp)',
    value: '250 Jt',
    description: 'Total penjualan keseluruhan',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Total Qty Penjualan',
    value: '5890 Kg',
    description: 'Total qty penjualan untuk customer terpilih',
    icon: Package,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Total Transaksi',
    value: '350 Transaksi',
    description: 'Total transaksi periode terpilih',
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 4,
    title: 'Customer yang Dilayani',
    value: '12 Customer',
    description: 'Customer yang Dialayani',
    icon: Users,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const salesRingkasanTargetData = {
  percentage: 31,
  targetGlobal: 'Rp 250 Jt',
  realisasi: 'Rp 89,2 Jt',
  selisih: 'Rp 185,8 Jt',
};

export const salesTargetRealisasiData = [
  {
    id: '1',
    title: 'Decorative',
    icon: PaintRoller,
    percentage: 80,
    realisasi: 'Rp 160 Jt',
    target: 'Rp 200 Jt',
  },
  {
    id: '2',
    title: 'Automotive',
    icon: Wrench,
    percentage: 81,
    realisasi: 'Rp 65 Jt',
    target: 'Rp 80 Jt',
  },
  {
    id: '3',
    title: 'Industri',
    icon: Factory,
    percentage: 90,
    realisasi: 'Rp 45 Jt',
    target: 'Rp 50 Jt',
  },
];

export const salesTrenPenjualanData = [
  { date: '01/07/2026', value: 30000000 },
  { date: '02/07/2026', value: 65000000 },
  { date: '03/07/2026', value: 55000000 },
  { date: '04/07/2026', value: 40000000 },
  { date: '05/07/2026', value: 45000000 },
  { date: '06/07/2026', value: 55000000 },
  { date: '07/07/2026', value: 80000000 },
  { date: '08/07/2026', value: 75000000 },
  { date: '09/07/2026', value: 65000000 },
  { date: '10/07/2026', value: 70000000 },
  { date: '11/07/2026', value: 60000000 },
  { date: '12/07/2026', value: 65000000 },
];

export const salesTopProductsData = [
  { id: 1, name: 'Crystal Coat', value: 80000000, max: 80000000, label: 'Rp 80 Jt' },
  { id: 2, name: 'Wiratex', value: 70000000, max: 80000000, label: 'Rp 70 Jt' },
  { id: 3, name: 'Petalac', value: 65000000, max: 80000000, label: 'Rp 65 Jt' },
  { id: 4, name: 'Shintex', value: 63000000, max: 80000000, label: 'Rp 63 Jt' },
  { id: 5, name: 'Supertex', value: 57000000, max: 80000000, label: 'Rp 57 Jt' },
  { id: 6, name: 'Kingkong', value: 50000000, max: 80000000, label: 'Rp 50 Jt' },
  { id: 7, name: 'Matex', value: 45000000, max: 80000000, label: 'Rp 45 Jt' },
  { id: 8, name: 'Nippon', value: 42000000, max: 80000000, label: 'Rp 42 Jt' },
  { id: 9, name: 'Dulux', value: 38000000, max: 80000000, label: 'Rp 38 Jt' },
  { id: 10, name: 'Avian', value: 30000000, max: 80000000, label: 'Rp 30 Jt' },
];

export const salesChartData = [
  { date: '01/07/2026', value: 30000000 },
  { date: '02/07/2026', value: 80000000 },
  { date: '03/07/2026', value: 70000000 },
  { date: '04/07/2026', value: 45000000 },
  { date: '05/07/2026', value: 50000000 },
  { date: '06/07/2026', value: 100162800 },
  { date: '07/07/2026', value: 95000000 },
  { date: '08/07/2026', value: 75000000 },
  { date: '09/07/2026', value: 85000000 },
  { date: '10/07/2026', value: 70000000 },
  { date: '11/07/2026', value: 82000000 },
  { date: '12/07/2026', value: 110000000 },
];
