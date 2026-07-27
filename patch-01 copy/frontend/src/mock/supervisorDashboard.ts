import { Wallet, Package, Users, Target, PaintRoller, Wrench, Factory, Banknote, User, Flag } from 'lucide-react';

export const supervisorKpiData = [
  {
    id: 1,
    title: 'Total Penjualan Tim',
    value: 'Rp 250 Jt',
    description: 'Total penjualan seluruh tim pada periode aktif',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Total Qty Penjualan',
    value: '5890 Kg',
    description: 'Total kuantitas produk yang berhasil dijual',
    icon: Package,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Total Sales',
    value: '12 Sales',
    description: 'Jumlah sales yang berada di bawah supervisor',
    icon: User,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 4,
    title: 'Pencapaian Target Tim',
    value: '87%',
    description: 'Persentase pencapaian target seluruh tim',
    icon: Flag,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 87,
  }
];

export const supervisorRingkasanTargetData = {
  percentage: 31,
  targetGlobal: 'Rp 12,0 M',
  realisasi: 'Rp 10,1 M',
  selisih: 'Rp 2,7 M',
};

export const supervisorTargetRealisasiData = [
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

export const supervisorChartData = [
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

export const supervisorTopProductsData = [
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

export const supervisorTableData = [
  { id: 1, sales: 'Heri', target: 'Rp 330 Jt', realisasi: 'Rp 310 Jt', pencapaian: 94 },
  { id: 2, sales: 'Rudi', target: 'Rp 250 Jt', realisasi: 'Rp 110 Jt', pencapaian: 40 },
  { id: 3, sales: 'Frans', target: 'Rp 276 Jt', realisasi: 'Rp 200 Jt', pencapaian: 70 },
  { id: 4, sales: 'Budi', target: 'Rp 150 Jt', realisasi: 'Rp 130 Jt', pencapaian: 90 },
  { id: 5, sales: 'Santoso', target: 'Rp 200 Jt', realisasi: 'Rp 180 Jt', pencapaian: 38 },
  { id: 6, sales: 'Agus', target: 'Rp 400 Jt', realisasi: 'Rp 420 Jt', pencapaian: 105 },
  { id: 7, sales: 'Iwan', target: 'Rp 150 Jt', realisasi: 'Rp 150 Jt', pencapaian: 100 },
  { id: 8, sales: 'Joko', target: 'Rp 220 Jt', realisasi: 'Rp 190 Jt', pencapaian: 86 },
  { id: 9, sales: 'Cipto', target: 'Rp 100 Jt', realisasi: 'Rp 60 Jt', pencapaian: 60 },
  { id: 10, sales: 'Gilang', target: 'Rp 280 Jt', realisasi: 'Rp 250 Jt', pencapaian: 89 },
  { id: 11, sales: 'Bagas', target: 'Rp 350 Jt', realisasi: 'Rp 350 Jt', pencapaian: 100 },
  { id: 12, sales: 'Wahyu', target: 'Rp 210 Jt', realisasi: 'Rp 160 Jt', pencapaian: 76 },
];
