const fs = require('fs');

const file = 'src/pages/admin/CustomerPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  "import { Upload, Filter, Eye, Package, Download, User, Users, Receipt, Map, MapPin, Wallet, CalendarClock, CreditCard } from 'lucide-react';",
  "import { Upload, Filter, Eye, Package, Download, User, Users, Receipt, Map, MapPin, Wallet, CalendarClock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';"
);

// Replace main KPI logic
const oldKpiLogic = `      // General KPIs (Combined totals)
      const totalPenjualanVal = allCustomers.reduce((acc: number, c: any) => acc + c.raw_total_penjualan, 0);
      const totalTxVal = allCustomers.reduce((acc: number, c: any) => acc + Number(c.totalTransaksi), 0);
      const totalCustomersVal = allCustomers.length;

      setKpis([
        {
          id: 1,
          title: 'Total Penjualan (Rp)',
          value: totalPenjualanVal >= 1e9 ? \`Rp \${(totalPenjualanVal / 1e9).toFixed(1)} M\` : \`Rp \${(totalPenjualanVal / 1e6).toFixed(1)} Jt\`,
          description: 'Total penjualan keseluruhan',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Total Transaksi',
          value: \`\${totalTxVal.toLocaleString('id-ID')} Transaksi\`,
          description: 'Total transaksi keseluruhan',
          icon: CreditCard,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 3,
          title: 'Total Customer',
          value: \`\${totalCustomersVal.toLocaleString('id-ID')} Customer\`,
          description: 'Total customer aktif yang terdaftar',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        }
      ]);`;

const newKpiLogic = `      const totalCustomersVal = allCustomers.length;
      const customerSudahOrderVal = allCustomers.filter((c: any) => Number(c.totalTransaksi) > 0 || c.raw_total_penjualan > 0).length;
      const customerBelumOrderVal = totalCustomersVal - customerSudahOrderVal;

      setKpis([
        {
          id: 1,
          title: 'Total Customer',
          value: \`\${totalCustomersVal.toLocaleString('id-ID')} Customer\`,
          description: 'Total customer aktif yang terdaftar',
          icon: Users,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },
        {
          id: 2,
          title: 'Customer Sudah Order',
          value: \`\${customerSudahOrderVal.toLocaleString('id-ID')} Customer\`,
          description: 'Total customer yang sudah melakukan order',
          icon: CheckCircle,
          iconColor: 'text-[#3b82f6]',
          iconBg: 'bg-[#dbeafe]',
        },
        {
          id: 3,
          title: 'Customer Belum Order',
          value: \`\${customerBelumOrderVal.toLocaleString('id-ID')} Customer\`,
          description: 'Total customer yang belum pernah order',
          icon: AlertCircle,
          iconColor: 'text-[#f59e0b]',
          iconBg: 'bg-[#fef3c7]',
        }
      ]);`;

content = content.replace(oldKpiLogic, newKpiLogic);

const oldKpiRender = `              if (kpi.id === 1) {
                return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan untuk customer terpilih" />;
              }
              if (kpi.id === 2) {
                return <KpiCard key={kpi.id} {...kpi} value={selectedCustomerData?.totalTransaksi ? \`\${selectedCustomerData.totalTransaksi} Transaksi\` : '0 Transaksi'} description="Total transaksi untuk customer terpilih" />;
              }
              if (kpi.id === 3) {
                return <KpiCard key={kpi.id} {...kpi} title="Total QTY (Kg)" value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
              }`;

const newKpiRender = `              if (kpi.id === 1) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Penjualan (Rp)" icon={Wallet} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan untuk customer terpilih" />;
              }
              if (kpi.id === 2) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Transaksi" icon={CreditCard} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalTransaksi ? \`\${selectedCustomerData.totalTransaksi} Transaksi\` : '0 Transaksi'} description="Total transaksi untuk customer terpilih" />;
              }
              if (kpi.id === 3) {
                return <KpiCard key={kpi.id} {...kpi} title="Total QTY (Kg)" icon={Package} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
              }`;

content = content.replace(oldKpiRender, newKpiRender);

fs.writeFileSync(file, content);
console.log('Done replacing KPI logic');
