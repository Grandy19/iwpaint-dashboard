import { FileText, CheckCircle2, XCircle, Users, Wallet, UserCheck } from 'lucide-react';

export const kpiData = [
  {
    id: 1,
    title: 'Total File Import',
    value: '125 File',
    description: 'Jumlah seluruh file yang pernah diimport',
    icon: FileText,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Import Berhasil',
    value: '120 File',
    description: 'Jumlah file yang berhasil diproses',
    icon: CheckCircle2,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Import Gagal',
    value: '5 File',
    description: 'Status Gagal',
    icon: XCircle,
    iconColor: 'text-[#ef4444]',
    iconBg: 'bg-[#fee2e2]',
  },
  {
    id: 4,
    title: 'Total Sales',
    value: '45 Sales',
    description: 'Total Seluruh Sales',
    icon: UserCheck,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 5,
    title: 'Total Customer',
    value: '2.350 Customer',
    description: 'Total Seluruh Customer',
    icon: Users,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 6,
    title: 'Total Transaksi',
    value: '85.320 Transaksi',
    description: 'Total Transaksi Keseluruhan',
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const progressData = {
  title: 'Input Target Sales',
  current: 10,
  total: 12,
  completedLabel: 'Sudah Input:',
  pendingLabel: 'Belum Input:',
  unit: 'Sales'
};

export const historyImportData = [
  { id: 1, name: 'Penjualan_Juli.xlsx', date: '13 Jul 2026 09:30', rows: '2.450', status: 'Berhasil' },
  { id: 2, name: 'Penjualan_Juni.xlsx', date: '27 Juni 2026 10:30', rows: '2.450', status: 'Gagal' },
  { id: 3, name: 'Penjualan_Mei.xlsx', date: '10 Mei 2026 11:30', rows: '2.680', status: 'Berhasil' },
  { id: 4, name: 'Penjualan_April.xlsx', date: '29 April 2026 09:00', rows: '2.510', status: 'Berhasil' },
  { id: 5, name: 'Penjualan_Maret.xlsx', date: '23 Maret 2026 08:30', rows: '2.680', status: 'Berhasil' },
  { id: 6, name: 'Penjualan_Februari.xlsx', date: '14 Feb 2026 14:15', rows: '2.100', status: 'Berhasil' },
  { id: 7, name: 'Penjualan_Januari.xlsx', date: '30 Jan 2026 10:00', rows: '2.890', status: 'Berhasil' },
  { id: 8, name: 'Penjualan_Desember.xlsx', date: '28 Des 2025 15:45', rows: '3.120', status: 'Berhasil' },
  { id: 9, name: 'Penjualan_November.xlsx', date: '15 Nov 2025 09:20', rows: '2.750', status: 'Gagal' },
  { id: 10, name: 'Penjualan_Oktober.xlsx', date: '22 Okt 2025 11:10', rows: '2.430', status: 'Berhasil' },
];

export const recentActivityData = [
  { id: 1, date: '13 Jul 2026 09:30', type: 'Import Data', description: 'penjualan_juli.xlsx', status: 'Berhasil', role: 'Admin', username: 'Admin01' },
  { id: 2, date: '27 Juni 2026 10:30', type: 'Target Sales', description: 'Update target Juli', status: 'Gagal', role: 'Admin', username: 'Admin02' },
  { id: 3, date: '10 Mei 2026 11:30', type: 'Manajemen User', description: 'Tambah user Fransiskus', status: 'Berhasil', role: 'Kepala Distributor', username: 'Bambang01' },
  { id: 4, date: '29 April 2026 09:00', type: 'Target Sales', description: 'Update target April', status: 'Berhasil', role: 'Admin', username: 'Admin01' },
  { id: 5, date: '23 Maret 2026 08:30', type: 'Export Data', description: 'penjualan_maret.xlsx', status: 'Berhasil', role: 'Supervisor', username: 'JokoSPV' },
  { id: 6, date: '14 Feb 2026 14:15', type: 'Manajemen User', description: 'Update peran Julianto', status: 'Berhasil', role: 'Admin', username: 'Admin03' },
  { id: 7, date: '30 Jan 2026 10:00', type: 'Import Data', description: 'penjualan_januari.xlsx', status: 'Berhasil', role: 'Sales', username: 'BudiSales' },
  { id: 8, date: '28 Des 2025 15:45', type: 'Login', description: 'Percobaan login gagal', status: 'Gagal', role: 'Supervisor', username: 'AndiSPV' },
  { id: 9, date: '15 Nov 2025 09:20', type: 'Export Data', description: 'Laporan_Tahunan.pdf', status: 'Berhasil', role: 'Kepala Distributor', username: 'Bambang01' },
  { id: 10, date: '22 Okt 2025 11:10', type: 'Target Sales', description: 'Penyesuaian target kuartal 4', status: 'Berhasil', role: 'Sales', username: 'CitraSales' },
];
