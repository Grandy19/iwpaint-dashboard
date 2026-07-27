import { Banknote, Target, Users } from 'lucide-react';

export const distributorSupervisorKpiData = [
  {
    id: 1,
    title: 'Total Penjualan Supervisor',
    value: 'Rp 2,45 M',
    description: 'Akumulasi penjualan seluruh supervisor.',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Pencapaian Target Supervisor',
    value: '91%',
    description: 'Persentase pencapaian target seluruh supervisor.',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 91,
  },
  {
    id: 3,
    title: 'Total Supervisor',
    value: '8 Supervisor',
    description: 'Total supervisor yang mengelola area distribusi.',
    icon: Users,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const distributorSupervisorTableData = [
  { id: 1, supervisor: 'Didi', email: 'didi@gmail.com', nomorHp: '098902838197', area: 'Bandung', jumlahSales: 12, totalPenjualan: 'Rp 20 Jt' },
  { id: 2, supervisor: 'Rafael', email: 'rafael@gmail.com', nomorHp: '098902838197', area: 'Cirebon', jumlahSales: 8, totalPenjualan: 'Rp 18,5 Jt' },
  { id: 3, supervisor: 'Julio', email: 'julio@gmail.com', nomorHp: '098902838197', area: 'Kuningan', jumlahSales: 11, totalPenjualan: 'Rp 14,6 Jt' },
  { id: 4, supervisor: 'Asep', email: 'asep@gmail.com', nomorHp: '098902838197', area: 'Tasikmalaya', jumlahSales: 14, totalPenjualan: 'Rp 13 Jt' },
  { id: 5, supervisor: 'Rahmat', email: 'rahmat@gmail.com', nomorHp: '098902838197', area: 'Garut', jumlahSales: 12, totalPenjualan: 'Rp 10,6 Jt' },
  { id: 6, supervisor: 'Rudi', email: 'rudi@gmail.com', nomorHp: '098902838197', area: 'Ciamis', jumlahSales: 10, totalPenjualan: 'Rp 9,8 Jt' },
  { id: 7, supervisor: 'Bambang', email: 'bambang@gmail.com', nomorHp: '098902838197', area: 'Sumedang', jumlahSales: 9, totalPenjualan: 'Rp 8,5 Jt' },
  { id: 8, supervisor: 'Joko', email: 'joko@gmail.com', nomorHp: '098902838197', area: 'Majalengka', jumlahSales: 7, totalPenjualan: 'Rp 7,2 Jt' },
];

export const mockSupervisorSalesData = [
  { id: 1, namaSales: 'Fransiskus', area: 'Bandung', customer: '12 Customer', target: 'Rp 15 Jt', realisasi: 'Rp 14 Jt' },
  { id: 2, namaSales: 'Deni', area: 'Bandung', customer: '8 Customer', target: 'Rp 10 Jt', realisasi: 'Rp 9 Jt' },
  { id: 3, namaSales: 'Eko', area: 'Jakarta', customer: '15 Customer', target: 'Rp 20 Jt', realisasi: 'Rp 15 Jt' },
  { id: 4, namaSales: 'Budi', area: 'Cirebon', customer: '10 Customer', target: 'Rp 12 Jt', realisasi: 'Rp 12 Jt' },
  { id: 5, namaSales: 'Siti', area: 'Kuningan', customer: '9 Customer', target: 'Rp 11 Jt', realisasi: 'Rp 10,5 Jt' },
  { id: 6, namaSales: 'Rina', area: 'Ciamis', customer: '11 Customer', target: 'Rp 14 Jt', realisasi: 'Rp 13 Jt' },
  { id: 7, namaSales: 'Ahmad', area: 'Tasikmalaya', customer: '14 Customer', target: 'Rp 18 Jt', realisasi: 'Rp 17 Jt' },
  { id: 8, namaSales: 'Andi', area: 'Garut', customer: '7 Customer', target: 'Rp 9 Jt', realisasi: 'Rp 8 Jt' },
  { id: 9, namaSales: 'Dedi', area: 'Sumedang', customer: '10 Customer', target: 'Rp 12 Jt', realisasi: 'Rp 10 Jt' },
  { id: 10, namaSales: 'Roni', area: 'Majalengka', customer: '8 Customer', target: 'Rp 10 Jt', realisasi: 'Rp 9,5 Jt' },
];
