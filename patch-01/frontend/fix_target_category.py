import os
import re

files = [
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\sales\SalesDashboardPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\supervisor\SupervisorDashboardPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\distributor\DistributorDashboardPage.tsx",
]

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the setTargetRealisasi block
    # It looks like:
    # setTargetRealisasi([
    #   { id: 'decorative', title: 'Decorative', ... },
    #   { id: 'automotive', title: 'Automotive', ... },
    #   { id: 'industri', title: 'Industri', ... }
    # ]);
    
    # We will replace it with dynamic pushing
    if "const allTargets = [];" in content:
        return # already processed

    if "salesRows.reduce" in content:
        # Supervisor
        replacement = """
      const allTargets = [];
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Decorative') {
        allTargets.push({
          id: 'decorative',
          title: 'Decorative',
          icon: PaintRoller,
          percentage: totalDecoTarget > 0 ? Math.min(Math.round((totalDecoRealisasi / totalDecoTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalDecoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalDecoTarget / 1e6).toFixed(1)} Jt`
        });
      }
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Automotive') {
        allTargets.push({
          id: 'automotive',
          title: 'Automotive',
          icon: Wrench,
          percentage: totalAutoTarget > 0 ? Math.min(Math.round((totalAutoRealisasi / totalAutoTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalAutoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalAutoTarget / 1e6).toFixed(1)} Jt`
        });
      }
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Industri') {
        allTargets.push({
          id: 'industri',
          title: 'Industri',
          icon: Factory,
          percentage: totalIndTarget > 0 ? Math.min(Math.round((totalIndRealisasi / totalIndTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalIndRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalIndTarget / 1e6).toFixed(1)} Jt`
        });
      }
      setTargetRealisasi(allTargets);"""
        content = re.sub(r"setTargetRealisasi\(\[[\s\S]*?\}\n\s*\]\);", replacement.strip(), content)

    elif "totalDecoTarget" in content:
        # Distributor
        replacement = """
      const allTargets = [];
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Decorative') {
        allTargets.push({
          id: 'decorative',
          title: 'Decorative',
          icon: PaintRoller,
          percentage: totalDecoTarget > 0 ? Math.min(Math.round((totalDecoRealisasi / totalDecoTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalDecoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalDecoTarget / 1e6).toFixed(1)} Jt`
        });
      }
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Automotive') {
        allTargets.push({
          id: 'automotive',
          title: 'Automotive',
          icon: Wrench,
          percentage: totalAutoTarget > 0 ? Math.min(Math.round((totalAutoRealisasi / totalAutoTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalAutoRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalAutoTarget / 1e6).toFixed(1)} Jt`
        });
      }
      if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Industri') {
        allTargets.push({
          id: 'industri',
          title: 'Industri',
          icon: Factory,
          percentage: totalIndTarget > 0 ? Math.min(Math.round((totalIndRealisasi / totalIndTarget) * 100), 100) : 0,
          realisasi: `Rp ${Number(totalIndRealisasi / 1e6).toFixed(1)} Jt`,
          target: `Rp ${Number(totalIndTarget / 1e6).toFixed(1)} Jt`
        });
      }
      setTargetRealisasi(allTargets);"""
        content = re.sub(r"setTargetRealisasi\(\[[\s\S]*?\}\n\s*\]\);", replacement.strip(), content)

    else:
        # Sales
        replacement = """
        const allTargets = [];
        if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Decorative') {
          allTargets.push({
            id: 'decorative',
            title: 'Decorative',
            icon: PaintRoller,
            percentage: myTargets.raw_target_deco > 0 ? Math.min(Math.round((myTargets.realisasi_deco / myTargets.raw_target_deco) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_deco / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_deco / 1e6).toFixed(1)} Jt`
          });
        }
        if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Automotive') {
          allTargets.push({
            id: 'automotive',
            title: 'Automotive',
            icon: Wrench,
            percentage: myTargets.raw_target_auto > 0 ? Math.min(Math.round((myTargets.realisasi_auto / myTargets.raw_target_auto) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_auto / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_auto / 1e6).toFixed(1)} Jt`
          });
        }
        if (kategoriProduk === 'Semua Kategori' || kategoriProduk === 'Industri') {
          allTargets.push({
            id: 'industri',
            title: 'Industri',
            icon: Factory,
            percentage: myTargets.raw_target_ind > 0 ? Math.min(Math.round((myTargets.realisasi_ind / myTargets.raw_target_ind) * 100), 100) : 0,
            realisasi: `Rp ${Number(myTargets.realisasi_ind / 1e6).toFixed(1)} Jt`,
            target: `Rp ${Number(myTargets.raw_target_ind / 1e6).toFixed(1)} Jt`
          });
        }
        setTargetRealisasi(allTargets);"""
        content = re.sub(r"setTargetRealisasi\(\[[\s\S]*?\}\n\s*\]\);", replacement.strip(), content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {os.path.basename(filepath)}")

for f in files:
    process_file(f)
