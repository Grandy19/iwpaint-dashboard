import { Banknote, Wallet, Package } from 'lucide-react';

export const customerKpiData = [
  {
    id: 1,
    title: 'Total Penjualan (Rp)',
    value: '250 Jt',
    description: 'Total penjualan filter terpilih',
    icon: Banknote,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 2,
    title: 'Total Transaksi',
    value: '350 Transaksi',
    description: 'Total qty penjualan filter terpilih', // Match the mockup typo or specific text
    icon: Wallet,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  },
  {
    id: 3,
    title: 'Total Qty Penjualan',
    value: '589 Kg',
    description: 'Total transaksi filter terpilih', // Match the mockup typo or specific text
    icon: Package,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-[#dcfce7]',
  }
];

export const customerTableData = [
  { id: 1, namaCustomer: 'TB Bangun Jaya', kodeCustomer: 'F.454', area: 'Bandung', totalTransaksi: 300, totalPenjualan: 'Rp 20 Jt' },
  { id: 2, namaCustomer: 'CV Sinar Mas', kodeCustomer: 'F.749', area: 'Bandung', totalTransaksi: 280, totalPenjualan: 'Rp 18,5 Jt' },
  { id: 3, namaCustomer: 'TB Toko Sejati', kodeCustomer: 'F.739', area: 'Bandung', totalTransaksi: 260, totalPenjualan: 'Rp 14,6 Jt' },
  { id: 4, namaCustomer: 'TB Sejahtera', kodeCustomer: 'F.730', area: 'Bandung', totalTransaksi: 230, totalPenjualan: 'Rp 13 Jt' },
  { id: 5, namaCustomer: 'CV Cirebon I', kodeCustomer: 'F.578', area: 'Cirebon', totalTransaksi: 210, totalPenjualan: 'Rp 10,6 Jt' },
  { id: 6, namaCustomer: 'TB Maju Terus', kodeCustomer: 'F.802', area: 'Jakarta', totalTransaksi: 190, totalPenjualan: 'Rp 9,2 Jt' },
  { id: 7, namaCustomer: 'PT Warna Indah', kodeCustomer: 'F.911', area: 'Bandung', totalTransaksi: 175, totalPenjualan: 'Rp 8,5 Jt' },
  { id: 8, namaCustomer: 'Toko Besi Karya', kodeCustomer: 'F.333', area: 'Cirebon', totalTransaksi: 160, totalPenjualan: 'Rp 7,8 Jt' },
  { id: 9, namaCustomer: 'UD Setia Abadi', kodeCustomer: 'F.651', area: 'Jakarta', totalTransaksi: 145, totalPenjualan: 'Rp 6,5 Jt' },
  { id: 10, namaCustomer: 'CV Multi Warna', kodeCustomer: 'F.420', area: 'Bandung', totalTransaksi: 130, totalPenjualan: 'Rp 5,4 Jt' }
];

export const customerTransactionData = [
  { id: 1, tanggal: '01/05/2026', noFaktur: '261.000023', customer: 'SUMBER JAYA', produk: 'Crystal Coat Thinner 1 LITER', qty: 24, satuan: 'KL', totalPenjualan: 'Rp 1.162.800' },
  { id: 2, tanggal: '01/06/2026', noFaktur: '261.000024', customer: 'SUMBER JAYA', produk: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 1, satuan: 'PL', totalPenjualan: 'Rp 360.750' },
  { id: 3, tanggal: '01/05/2026', noFaktur: '261.000025', customer: 'Kriya Nusa', produk: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 12, satuan: 'KL', totalPenjualan: 'Rp 594.000' },
  { id: 4, tanggal: '30/04/2026', noFaktur: '261.000021', customer: 'Kriya Nusa', produk: 'Petalac 2K PU Hardener', qty: 1, satuan: 'GL', totalPenjualan: 'Rp 360.750' },
  { id: 5, tanggal: '30/04/2026', noFaktur: '261.000021', customer: 'Kriya Nusa', produk: 'Wiratex Wall Paint Putih Salju 25 KG', qty: 24, satuan: 'KL', totalPenjualan: 'Rp 1.162.800' },
  { id: 6, tanggal: '28/04/2026', noFaktur: '261.000020', customer: 'TB Maju Terus', produk: 'Mowilex VIP 20 LITER', qty: 5, satuan: 'PL', totalPenjualan: 'Rp 2.500.000' },
  { id: 7, tanggal: '27/04/2026', noFaktur: '261.000019', customer: 'PT Warna Indah', produk: 'Nippon Paint Elastex 20 KG', qty: 10, satuan: 'KL', totalPenjualan: 'Rp 1.850.000' },
  { id: 8, tanggal: '25/04/2026', noFaktur: '261.000018', customer: 'Toko Besi Karya', produk: 'Avian Cat Kayu 1 KG', qty: 30, satuan: 'KL', totalPenjualan: 'Rp 1.350.000' },
  { id: 9, tanggal: '24/04/2026', noFaktur: '261.000017', customer: 'UD Setia Abadi', produk: 'Crystal Coat Thinner 5 LITER', qty: 15, satuan: 'GL', totalPenjualan: 'Rp 950.000' },
  { id: 10, tanggal: '22/04/2026', noFaktur: '261.000016', customer: 'CV Multi Warna', produk: 'Dulux Catylac 25 KG', qty: 8, satuan: 'PL', totalPenjualan: 'Rp 3.100.000' }
];
