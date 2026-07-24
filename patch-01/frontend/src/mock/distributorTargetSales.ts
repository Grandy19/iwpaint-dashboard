import { Target, Banknote, TrendingUp, PaintRoller, Wrench, Factory, Flag } from 'lucide-react';

export const distributorTargetKpiData = [
  {
    id: 1,
    title: 'Target Penjualan Area',
    value: 'Rp 12,8 M',
    description: 'Total target penjualan seluruh area distribusi.',
    icon: Target,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Realisasi Penjualan Area',
    value: 'Rp 10,1 M',
    description: 'Total realisasi penjualan seluruh area.',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Pencapaian Target Area',
    value: '87%',
    description: 'Persentase pencapaian target area.',
    icon: TrendingUp,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
    progress: 87,
  },
  {
    id: 4,
    title: 'Area Mencapai Target',
    value: '5 / 8 Area',
    description: 'Jumlah area yang telah mencapai target.',
    icon: Flag,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const distributorTargetSummaryData = {
  percentage: 31,
  targetGlobal: 'Rp 12,8 M',
  realisasi: 'Rp 10,1 M',
  selisih: 'Rp 2,7 M',
  selisihLabel: 'Selisih'
};

export const distributorTargetCategoryData = [
  {
    id: '1',
    title: 'Decorative',
    icon: PaintRoller,
    percentage: 80,
    target: 'Rp 200 Jt',
    realisasi: 'Rp 160 Jt'
  },
  {
    id: '2',
    title: 'Automotive',
    icon: Wrench,
    percentage: 81,
    target: 'Rp 80 Jt',
    realisasi: 'Rp 65 Jt'
  },
  {
    id: '3',
    title: 'Industri',
    icon: Factory,
    percentage: 90,
    target: 'Rp 50 Jt',
    realisasi: 'Rp 45 Jt'
  }
];

export const distributorTargetAreaPerformance = [
  { 
    id: 1, area: 'Bandung', target: 'Rp 3,2 M', realisasi: 'Rp 3,0 M', qty: '7.200 Kg', pencapaian: '94%', status: 'Belum Tercapai',
    categories: [
      { name: 'Decorative', target: 'Rp 1,5 M', realisasi: 'Rp 1,4 M' },
      { name: 'Automotive', target: 'Rp 1,0 M', realisasi: 'Rp 900 Jt' },
      { name: 'Industri', target: 'Rp 700 Jt', realisasi: 'Rp 700 Jt' }
    ]
  },
  { 
    id: 2, area: 'Kuningan', target: 'Rp 2,8 M', realisasi: 'Rp 2,8 M', qty: '6.100 Kg', pencapaian: '100%', status: 'Tercapai',
    categories: [
      { name: 'Decorative', target: 'Rp 1,0 M', realisasi: 'Rp 1,0 M' },
      { name: 'Automotive', target: 'Rp 1,0 M', realisasi: 'Rp 1,0 M' },
      { name: 'Industri', target: 'Rp 800 Jt', realisasi: 'Rp 800 Jt' }
    ]
  },
  { 
    id: 3, area: 'Tasikmalaya', target: 'Rp 1,9 M', realisasi: 'Rp 1,9 M', qty: '4.200 Kg', pencapaian: '100%', status: 'Tercapai',
    categories: [
      { name: 'Decorative', target: 'Rp 900 Jt', realisasi: 'Rp 900 Jt' },
      { name: 'Automotive', target: 'Rp 500 Jt', realisasi: 'Rp 500 Jt' },
      { name: 'Industri', target: 'Rp 500 Jt', realisasi: 'Rp 500 Jt' }
    ]
  },
  { 
    id: 4, area: 'Garut', target: 'Rp 1,5 M', realisasi: 'Rp 1,3 M', qty: '3.100 Kg', pencapaian: '87%', status: 'Belum Tercapai',
    categories: [
      { name: 'Decorative', target: 'Rp 700 Jt', realisasi: 'Rp 600 Jt' },
      { name: 'Automotive', target: 'Rp 500 Jt', realisasi: 'Rp 400 Jt' },
      { name: 'Industri', target: 'Rp 300 Jt', realisasi: 'Rp 300 Jt' }
    ]
  },
  { 
    id: 5, area: 'Cirebon', target: 'Rp 1,2 M', realisasi: 'Rp 1,0 M', qty: '2.900 Kg', pencapaian: '82%', status: 'Belum Tercapai',
    categories: [
      { name: 'Decorative', target: 'Rp 500 Jt', realisasi: 'Rp 400 Jt' },
      { name: 'Automotive', target: 'Rp 400 Jt', realisasi: 'Rp 300 Jt' },
      { name: 'Industri', target: 'Rp 300 Jt', realisasi: 'Rp 300 Jt' }
    ]
  },
];

export const distributorTargetSupervisorPerformance = [
  { id: 1, supervisor: 'Didi', area: 'Bandung', target: 'Rp 3,2 M', realisasi: 'Rp 3,0 M', qty: '7.200 Kg', pencapaian: '94%', status: 'Hampir Tercapai', jumlahSales: 12 },
  { id: 2, supervisor: 'Rafael', area: 'Cirebon', target: 'Rp 2,8 M', realisasi: 'Rp 2,5 M', qty: '6.150 Kg', pencapaian: '89%', status: 'Hampir Tercapai', jumlahSales: 8 },
  { id: 3, supervisor: 'Julio', area: 'Tasikmalaya', target: 'Rp 1,9 M', realisasi: 'Rp 1,7 M', qty: '4.200 Kg', pencapaian: '90%', status: 'Hampir Tercapai', jumlahSales: 10 },
  { id: 4, supervisor: 'Asep', area: 'Kuningan', target: 'Rp 1,5 M', realisasi: 'Rp 1,2 M', qty: '3.100 Kg', pencapaian: '80%', status: 'Belum Tercapai', jumlahSales: 6 },
  { id: 5, supervisor: 'Rahmat', area: 'Garut', target: 'Rp 1,4 M', realisasi: 'Rp 1,3 M', qty: '2.850 Kg', pencapaian: '93%', status: 'Hampir Tercapai', jumlahSales: 7 },
  { id: 6, supervisor: 'Rudi', area: 'Sumedang', target: 'Rp 1,2 M', realisasi: 'Rp 1,2 M', qty: '2.500 Kg', pencapaian: '100%', status: 'Tercapai', jumlahSales: 5 },
  { id: 7, supervisor: 'Joko', area: 'Majalengka', target: 'Rp 1,0 M', realisasi: 'Rp 1,0 M', qty: '2.100 Kg', pencapaian: '100%', status: 'Tercapai', jumlahSales: 4 },
  { id: 8, supervisor: 'Bambang', area: 'Ciamis', target: 'Rp 1,0 M', realisasi: 'Rp 1,0 M', qty: '2.000 Kg', pencapaian: '100%', status: 'Tercapai', jumlahSales: 4 },
];

export const distributorTargetHistory = [
  { id: 1, periode: 'Juli 2026', target: 'Rp 200 Jt', realisasi: 'Rp 180 Jt', pencapaian: '83%', status: 'Belum Tercapai' },
  { id: 2, periode: 'Juni 2026', target: 'Rp 180 Jt', realisasi: 'Rp 180 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 3, periode: 'Mei 2026', target: 'Rp 180 Jt', realisasi: 'Rp 180 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 4, periode: 'April 2026', target: 'Rp 300 Jt', realisasi: 'Rp 290 Jt', pencapaian: '90%', status: 'Belum Tercapai' },
  { id: 5, periode: 'Maret 2026', target: 'Rp 140 Jt', realisasi: 'Rp 138 Jt', pencapaian: '93%', status: 'Belum Tercapai' },
];

export const distributorSupervisorTargetSalesBawahan = [
  { id: 1, namaSales: 'Fransiskus', target: 'Rp 150 Jt', realisasi: 'Rp 140 Jt', pencapaian: '93%', status: 'Hampir Tercapai' },
  { id: 2, namaSales: 'Deni', target: 'Rp 120 Jt', realisasi: 'Rp 120 Jt', pencapaian: '100%', status: 'Tercapai' },
  { id: 3, namaSales: 'Budi', target: 'Rp 180 Jt', realisasi: 'Rp 150 Jt', pencapaian: '83%', status: 'Belum Tercapai' },
  { id: 4, namaSales: 'Eko', target: 'Rp 200 Jt', realisasi: 'Rp 205 Jt', pencapaian: '102%', status: 'Tercapai' },
  { id: 5, namaSales: 'Siti', target: 'Rp 100 Jt', realisasi: 'Rp 95 Jt', pencapaian: '95%', status: 'Hampir Tercapai' },
];
