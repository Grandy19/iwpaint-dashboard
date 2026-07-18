import { Target, CheckCircle2, XCircle, UserCheck, User } from 'lucide-react';
import { CustomSalesIcon } from '../components/common/CustomSalesIcon';

export const targetSalesKpiData = [
  {
    id: 1,
    title: 'Total Sales',
    value: '45 Sales',
    description: 'Total Semua Sales',
    icon: User,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Total Target Bulan Ini',
    value: 'Rp12,8 M',
    description: 'Total Target Bulan Juli 2026',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Sales Sudah Memiliki Target',
    value: '42 Sales',
    description: 'Target Juli 2026 telah diinput',
    icon: CheckCircle2,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 4,
    title: 'Sales Belum Memiliki Target',
    value: '3 Sales',
    description: 'Target Juli 2026 belum diinput',
    icon: XCircle,
    iconColor: 'text-[#ef4444]',
    iconBg: 'bg-[#fee2e2]',
  },
];

export const targetSalesSummary = {
  percentage: 31,
  targetGlobal: 'Rp 250 Jt',
  realisasi: 'Rp 89,2 Jt',
  selisih: 'Rp 160,8 Jt'
};

export const targetSalesTableData = [
  { id: 1, sales: 'Heri', area: 'Bandung', decorative: 'Rp 200 Jt', automotive: 'Rp 80 Jt', industri: 'Rp 50 Jt', totalTarget: 'Rp 330 Jt', status: 'Sudah Input' },
  { id: 2, sales: 'Fransiskus', area: 'Bandung', decorative: 'Rp 180 Jt', automotive: 'Rp 70 Jt', industri: 'Rp 48 Jt', totalTarget: 'Rp 298 Jt', status: 'Sudah Input' },
  { id: 3, sales: 'Rudi', area: 'Bandung', decorative: 'Rp 160 Jt', automotive: 'Rp 60 Jt', industri: 'Rp 43 Jt', totalTarget: 'Rp 263 Jt', status: 'Sudah Input' },
  { id: 4, sales: 'Budi', area: 'Cirebon', decorative: 'Rp 130 Jt', automotive: 'Rp 57 Jt', industri: 'Rp 40 Jt', totalTarget: 'Rp 227 Jt', status: 'Sudah Input' },
  { id: 5, sales: 'Santoso', area: '-', decorative: '-', automotive: '-', industri: '-', totalTarget: '-', status: 'Belum Input' },
  { id: 6, sales: 'Agus', area: 'Jakarta', decorative: 'Rp 210 Jt', automotive: 'Rp 90 Jt', industri: 'Rp 60 Jt', totalTarget: 'Rp 360 Jt', status: 'Sudah Input' },
  { id: 7, sales: 'Iwan', area: 'Semarang', decorative: 'Rp 150 Jt', automotive: 'Rp 50 Jt', industri: 'Rp 35 Jt', totalTarget: 'Rp 235 Jt', status: 'Sudah Input' },
  { id: 8, sales: 'Eko', area: '-', decorative: '-', automotive: '-', industri: '-', totalTarget: '-', status: 'Belum Input' },
  { id: 9, sales: 'Joko', area: 'Surabaya', decorative: 'Rp 250 Jt', automotive: 'Rp 100 Jt', industri: 'Rp 75 Jt', totalTarget: 'Rp 425 Jt', status: 'Sudah Input' },
  { id: 10, sales: 'Siti', area: '-', decorative: '-', automotive: '-', industri: '-', totalTarget: '-', status: 'Belum Input' },
];
