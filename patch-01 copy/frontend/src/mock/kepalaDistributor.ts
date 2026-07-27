import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export const kepalaDistributorKpiData = [
  {
    id: 1,
    title: 'Total Kepala Distributor',
    value: '7 Kepala Distributor',
    description: 'Total seluruh Kepala Distributor yang terdaftar.',
    icon: ShieldCheck,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Kepala Distributor Aktif',
    value: '5 Kepala Distributor',
    description: 'Kepala Distributor dengan status aktif.',
    icon: CheckCircle2,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Kepala Distributor Tidak Aktif',
    value: '2 Kepala Distributor',
    description: 'Kepala Distributor dengan status tidak aktif.',
    icon: XCircle,
    iconColor: 'text-[#ef4444]',
    iconBg: 'bg-[#fee2e2]',
  },
];

export const kepalaDistributorTableData = [
  { id: 1, namaKepalaDistributor: 'Bambang', email: 'bambang@gmail.com', nomorHp: '089567182781', area: 'Jawa Barat', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 2, namaKepalaDistributor: 'Hendra', email: 'hendra@gmail.com', nomorHp: '089567182781', area: 'Jawa Tengah', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 3, namaKepalaDistributor: 'Dedi', email: 'dedi@gmail.com', nomorHp: '089567182781', area: 'Jawa Timur', status: 'Aktif', tanggalBergabung: '16 Jul 2026' },
  { id: 4, namaKepalaDistributor: 'Anton', email: 'anton@gmail.com', nomorHp: '089567182781', area: 'Sumatera', status: 'Aktif', tanggalBergabung: '15 Jul 2026' },
  { id: 5, namaKepalaDistributor: 'Gery', email: 'gery@gmail.com', nomorHp: '089567182781', area: 'DKI Jakarta', status: 'Aktif', tanggalBergabung: '15 Jul 2026' },
  { id: 6, namaKepalaDistributor: 'Doni', email: 'doni@gmail.com', nomorHp: '089567182781', area: 'Kalimantan', status: 'Tidak Aktif', tanggalBergabung: '10 Jul 2026' },
  { id: 7, namaKepalaDistributor: 'Riko', email: 'riko@gmail.com', nomorHp: '089567182781', area: 'Sulawesi', status: 'Tidak Aktif', tanggalBergabung: '05 Jul 2026' },
];
