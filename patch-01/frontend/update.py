import re

with open('src/pages/admin/CustomerPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
if 'CheckCircle' not in content:
    content = re.sub(r"import \{([^}]+)\} from 'lucide-react';", r"import {\1, CheckCircle, AlertCircle} from 'lucide-react';", content)

# 2. KPIs
old_kpi = r"""      // General KPIs (Combined totals)
      const totalPenjualanVal = allCustomers.reduce((acc: number, c: any) => acc + c.raw_total_penjualan, 0);
      const totalTxVal = allCustomers.reduce((acc: number, c: any) => acc + Number(c.totalTransaksi), 0);
      const totalCustomersVal = allCustomers.length;

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: totalPenjualanVal >= 1e9 ? `Rp ${Math.abs(totalPenjualanVal / 1e9).toFixed(1)} M` : `Rp ${Math.abs(totalPenjualanVal / 1e6).toFixed(1)} Jt`,
          description: 'Total penjualan keseluruhan',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Transaksi',
          value: `${totalTxVal.toLocaleString('id-ID')} Transaksi`,
          description: 'Total transaksi keseluruhan',
          icon: CreditCard,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Customer',
          value: `${totalCustomersVal.toLocaleString('id-ID')} Customer`,
          description: 'Total customer aktif yang terdaftar',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);"""
      
# Let's just do a simple replacement for the first part of the KPI string to be absolutely safe
content = re.sub(r"// General KPIs \(Combined totals\)[\s\S]*?setKpis\(\[[\s\S]*?\]\);", 
r"""const totalCustomersVal = allCustomers.length;
      const customerSudahOrderVal = allCustomers.filter((c: any) => Number(c.totalTransaksi) > 0 || c.raw_total_penjualan > 0).length;
      const customerBelumOrderVal = totalCustomersVal - customerSudahOrderVal;

      setKpis([
        {
          id: 1,
          title: 'Total Customer',
          value: `${totalCustomersVal.toLocaleString('id-ID')} Customer`,
          description: 'Total customer aktif yang terdaftar',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Customer Sudah Order',
          value: `${customerSudahOrderVal.toLocaleString('id-ID')} Customer`,
          description: 'Total customer yang sudah melakukan order',
          icon: CheckCircle,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Customer Belum Order',
          value: `${customerBelumOrderVal.toLocaleString('id-ID')} Customer`,
          description: 'Total customer yang belum pernah order',
          icon: AlertCircle,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        }
      ]);""", content)


content = re.sub(r"if \(kpi\.id === 1\) \{[\s\S]*?if \(kpi\.id === 3\) \{[\s\S]*?\}",
r"""if (kpi.id === 1) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Penjualan (Rp)" icon={Wallet} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan untuk customer terpilih" />;
              }
              if (kpi.id === 2) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Transaksi" icon={CreditCard} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalTransaksi ? `${selectedCustomerData.totalTransaksi} Transaksi` : '0 Transaksi'} description="Total transaksi untuk customer terpilih" />;
              }
              if (kpi.id === 3) {
                return <KpiCard key={kpi.id} {...kpi} title="Total QTY (Kg)" icon={Package} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
              }""", content)

with open('src/pages/admin/CustomerPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully via python.")
