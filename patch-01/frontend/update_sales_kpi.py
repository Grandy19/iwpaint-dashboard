import re

file_path = 'src/pages/sales/SalesDashboardPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the "Total Transaksi" KPI block
# Find the KPI block
# Since we know exactly how the KPI for Total Transaksi looks like:
old_kpi = r"""        {
          id: 3,
          title: 'Total Transaksi',
          value: `${kpis.total_transactions} Transaksi`,
          description: 'Total transaksi periode terpilih',
          icon: Wallet,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },"""

new_kpi = r"""        {
          id: 3,
          title: 'Pencapaian Target',
          value: `${targetPerfRes.data.percentage}%`,
          description: 'Persentase pencapaian target',
          icon: Target,
          iconColor: 'text-[#10b981]',
          iconBg: 'bg-[#dcfce7]',
        },"""

# We need to move the `targetPerfRes` fetch to be BEFORE the `setKpiData` call.
# Let's see the exact `setKpiData` block and the `targetPerfRes` block.
# Actually, I can just do a precise regex replace.

target_perf_block = r"""      // Resolve target year & month dynamically
      const dateObj = new Date(periodeAwal);
      const targetYear = dateObj.getFullYear() || 2026;
      const monthNamesInd = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
      const targetMonthName = monthNamesInd[dateObj.getMonth()] || "Juli";

      // Fetch targets performance summary
      const targetPerfRes = await api.get('/targets/performance', { params: { salesman: salesmanName, tahun: targetYear, bulan_nama: targetMonthName, periodeAwal, periodeAkhir } });
      setRingkasanTarget(targetPerfRes.data);"""

# I will extract target_perf_block and move it before setKpiData
if 'setRingkasanTarget(targetPerfRes.data);' in content:
    # Remove the target_perf_block from its original place
    content = content.replace(target_perf_block, '')
    
    # Insert target_perf_block right before setKpiData
    setkpi_start = r"      setKpiData(["
    content = content.replace(setkpi_start, target_perf_block + "\n\n" + setkpi_start)
    
    # Replace the KPI 3
    content = content.replace(old_kpi, new_kpi)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Python update script executed.")
