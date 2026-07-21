import { Banknote, Package, Users, Target, PaintRoller, Wrench, Factory, UserCheck, Flag, LayoutDashboard, User } from 'lucide-react';

export const distributorMenuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
  { name: 'Supervisor', icon: UserCheck, path: '/distributor-dashboard/supervisor' },
  { name: 'Sales', icon: User, path: '/distributor-dashboard/sales' },
  { name: 'Customer', icon: Users, path: '/distributor-dashboard/customer' },
  { name: 'Target Penjualan', icon: Target, path: '/distributor-dashboard/target-sales' },
];

export const distributorKpiData = [
  {
    id: 1,
    title: 'Total Penjualan Tim',
    value: 'Rp 12,8 M',
    description: 'Total penjualan seluruh area distribusi.',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Total Qty Penjualan',
    value: '28.450 Kg',
    description: 'Total kuantitas produk terjual.',
    icon: Package,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Total Supervisor',
    value: '8 Supervisor',
    description: 'Supervisor yang mengelola area distribusi.',
    icon: UserCheck,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 4,
    title: 'Pencapaian Target Area',
    value: '87%',
    description: 'Persentase pencapaian target area.',
    icon: Flag,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 87,
  },
];

export const distributorRingkasanTargetData = {
  percentage: 31,
  targetGlobal: 'Rp 12,8 M',
  realisasi: 'Rp 10,1 M',
  selisih: 'Rp 2,7 M'
};

export const distributorChartData = Array.from({ length: 30 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  return {
    date: `${day}/07/2026`,
    value: Math.floor(40000000 + Math.random() * 60000000)
  };
});

export const distributorTableData = [
  { id: 1, supervisor: 'Didi', area: 'Bandung', target: 'Rp 2,4 M', realisasi: 'Rp 2 M', qty: '4.000 Kg', pencapaian: 94 },
  { id: 2, supervisor: 'Rafael', area: 'Cirebon', target: 'Rp 2,3 M', realisasi: 'Rp 2,1 M', qty: '4.200 Kg', pencapaian: 90 },
  { id: 3, supervisor: 'Julio', area: 'Kuningan', target: 'Rp 1,8 M', realisasi: 'Rp 1,5 M', qty: '3.502 Kg', pencapaian: 86 },
  { id: 4, supervisor: 'Asep', area: 'Tasikmalaya', target: 'Rp 1,2 M', realisasi: 'Rp 900 Jt', qty: '3.136 Kg', pencapaian: 74 },
  { id: 5, supervisor: 'Rahmat', area: 'Garut', target: 'Rp 1,5 M', realisasi: 'Rp 1,3 M', qty: '2.800 Kg', pencapaian: 48 },
  { id: 6, supervisor: 'Rudi', area: 'Ciamis', target: 'Rp 1,0 M', realisasi: 'Rp 850 Jt', qty: '2.100 Kg', pencapaian: 85 },
  { id: 7, supervisor: 'Bambang', area: 'Sumedang', target: 'Rp 1,1 M', realisasi: 'Rp 800 Jt', qty: '1.950 Kg', pencapaian: 72 },
  { id: 8, supervisor: 'Joko', area: 'Majalengka', target: 'Rp 1,5 M', realisasi: 'Rp 850 Jt', qty: '1.850 Kg', pencapaian: 56 },
];

export const distributorTargetRealisasiData = [
  { id: '1', title: 'Decorative', icon: PaintRoller, target: 'Rp 200 Jt', realisasi: 'Rp 160 Jt', percentage: 80 },
  { id: '2', title: 'Automotive', icon: Wrench, target: 'Rp 80 Jt', realisasi: 'Rp 65 Jt', percentage: 81 },
  { id: '3', title: 'Industri', icon: Factory, target: 'Rp 50 Jt', realisasi: 'Rp 45 Jt', percentage: 90 },
];

export const distributorTopProductsData = [
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
