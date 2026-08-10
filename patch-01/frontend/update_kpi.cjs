const fs = require('fs');
const file = 'src/pages/admin/CustomerPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add missing imports
if (!content.includes('CheckCircle')) {
  content = content.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    "import { $1, CheckCircle, AlertCircle } from 'lucide-react';"
  );
}

// 2. Replace KPI array logic
const kpiLogicRegex = /\/\/ General KPIs \(Combined totals\)[^\]]+\]\);\s+/;
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
      ]);
`;
content = content.replace(kpiLogicRegex, newKpiLogic);

// 3. Replace single customer render logic
const renderRegex = /if \(kpi\.id === 1\) \{[\s\S]*?if \(kpi\.id === 3\) \{[\s\S]*?\}/;
const newRenderLogic = `if (kpi.id === 1) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Penjualan (Rp)" icon={Wallet} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalPenjualan || 'Rp 0 Jt'} description="Total penjualan untuk customer terpilih" />;
              }
              if (kpi.id === 2) {
                return <KpiCard key={kpi.id} {...kpi} title="Total Transaksi" icon={CreditCard} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalTransaksi ? \`\${selectedCustomerData.totalTransaksi} Transaksi\` : '0 Transaksi'} description="Total transaksi untuk customer terpilih" />;
              }
              if (kpi.id === 3) {
                return <KpiCard key={kpi.id} {...kpi} title="Total QTY (Kg)" icon={Package} iconColor="text-[#10b981]" iconBg="bg-[#dcfce7]" value={selectedCustomerData?.totalQty || '0 Kg'} description="Total qty penjualan untuk customer terpilih" />;
              }`;
content = content.replace(renderRegex, newRenderLogic);

fs.writeFileSync(file, content);
console.log('Update script finished');
