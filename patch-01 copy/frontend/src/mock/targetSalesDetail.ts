import { Wallet, Package, Target, CreditCard, Users, PaintRoller, Wrench, Factory } from 'lucide-react';

export const salesDetailKpiData = [
  {
    id: 1,
    title: 'Total Penjualan (Rp)',
    value: 'Rp 89,2 Jt',
    description: 'Total penjualan pada periode terpilih',
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    percentageLabel: '35.68%',
  },
  {
    id: 2,
    title: 'Total Target Bulan Ini',
    value: 'Rp 250 Jt',
    description: 'Target untuk bulan Juli 2026',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Total Customer',
    value: '42 Customer',
    description: 'Customer yang dilayani',
    icon: Users,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 4,
    title: 'Total Transaksi',
    value: '350 Transaksi',
    description: 'Periode Juni 2026',
    icon: CreditCard,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
];

export const salesDetailSummary = {
  percentage: 35.68,
  targetGlobal: 'Rp 250 Jt',
  realisasi: 'Rp 89,2 Jt',
  selisih: 'Rp 185,8 Jt'
};

export const salesDetailTargetRealisasi = [
  {
    id: 'decorative',
    title: 'Decorative',
    icon: PaintRoller,
    percentage: 80,
    realisasi: 'Rp 160 Jt',
    target: 'Rp 200 Jt'
  },
  {
    id: 'automotive',
    title: 'Automotive',
    icon: Wrench,
    percentage: 81,
    realisasi: 'Rp 65 Jt',
    target: 'Rp 80 Jt'
  },
  {
    id: 'industri',
    title: 'Industri',
    icon: Factory,
    percentage: 90,
    realisasi: 'Rp 45 Jt',
    target: 'Rp 50 Jt'
  }
];
