import { UserCheck, CheckCircle2, XCircle } from 'lucide-react';

export const supervisorKpiData = [
  {
    id: 1,
    title: 'Total Supervisor',
    value: '45 Supervisor',
    description: 'Total supervisor yang terdaftar pada sistem',
    icon: UserCheck,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Supervisor Aktif',
    value: '42 Supervisor',
    description: 'Supervisor dengan status aktif',
    icon: CheckCircle2,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Supervisor Tidak Aktif',
    value: '3 Supervisor',
    description: 'Supervisor dengan status tidak aktif',
    icon: XCircle,
    iconColor: 'text-[#ef4444]',
    iconBg: 'bg-[#fee2e2]',
  },
];

export const supervisorTableData = [
  { id: 1, namaSupervisor: 'Andi', email: 'andi@gmail.com', nomorHp: '081290923456', area: 'Bandung', jumlahSales: '12 Sales', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 2, namaSupervisor: 'Hariono', email: 'hariono@gmail.com', nomorHp: '081290923456', area: 'Cirebon', jumlahSales: '12 Sales', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 3, namaSupervisor: 'Deni', email: 'deni@gmail.com', nomorHp: '081290923456', area: 'Kuningan', jumlahSales: '12 Sales', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 4, namaSupervisor: 'Rahmat', email: 'rahmat@gmail.com', nomorHp: '081290923456', area: 'Tasikmalaya', jumlahSales: '12 Sales', status: 'Aktif', tanggalBergabung: '15 Jul 2026' },
  { id: 5, namaSupervisor: 'Dudu', email: 'dudu@gmail.com', nomorHp: '081290923456', area: 'Bogor', jumlahSales: '12 Sales', status: 'Aktif', tanggalBergabung: '15 Jul 2026' },
  { id: 6, namaSupervisor: 'Eka', email: 'eka@gmail.com', nomorHp: '081290923456', area: 'Jakarta', jumlahSales: '10 Sales', status: 'Aktif', tanggalBergabung: '14 Jul 2026' },
  { id: 7, namaSupervisor: 'Tono', email: 'tono@gmail.com', nomorHp: '081290923456', area: 'Bandung', jumlahSales: '8 Sales', status: 'Tidak Aktif', tanggalBergabung: '10 Jul 2026' },
  { id: 8, namaSupervisor: 'Siti', email: 'siti@gmail.com', nomorHp: '081290923456', area: 'Cirebon', jumlahSales: '15 Sales', status: 'Aktif', tanggalBergabung: '05 Jul 2026' },
  { id: 9, namaSupervisor: 'Joko', email: 'joko@gmail.com', nomorHp: '081290923456', area: 'Kuningan', jumlahSales: '5 Sales', status: 'Tidak Aktif', tanggalBergabung: '01 Jul 2026' },
  { id: 10, namaSupervisor: 'Hasan', email: 'hasan@gmail.com', nomorHp: '081290923456', area: 'Garut', jumlahSales: '11 Sales', status: 'Aktif', tanggalBergabung: '25 Jun 2026' },
];
