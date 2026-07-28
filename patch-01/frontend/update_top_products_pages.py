import os
import re

files = [
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\distributor\DistributorCustomerPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\distributor\DistributorDashboardPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\sales\SalesCustomerPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\sales\SalesDashboardPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\supervisor\SupervisorCustomerPage.tsx",
    r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\supervisor\SupervisorDashboardPage.tsx"
]

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # The mapping usually looks like:
    # setTopProducts(products.map((p: any, idx: number) => ({
    #   id: idx + 1,
    #   name: p.nama_produk,
    #   value: p.total_sales,
    #   max: maxVal,
    #   label: p.total_sales >= 1e6 ? `Rp ${(p.total_sales / 1e6).toFixed(1)} Jt` : `Rp ${Number(p.total_sales).toLocaleString('id-ID')}`
    # })));
    
    # We want to replace it with:
    # setTopProducts(products.map((p: any, idx: number) => ({
    #   id: idx + 1,
    #   name: p.nama_produk,
    #   salesValue: p.total_sales,
    #   qtyValue: p.total_qty || 0
    # })));
    
    pattern = r"setTopProducts\(products\.map\(\(p:\s*any,\s*idx:\s*number\)\s*=>\s*\(\{\s*id:\s*idx\s*\+\s*1,\s*name:\s*p\.nama_produk,\s*value:\s*p\.total_sales,\s*max:\s*maxVal,\s*label:[\s\S]*?\}\)\)\);"
    
    replacement = """setTopProducts(products.map((p: any, idx: number) => ({
        id: idx + 1,
        name: p.nama_produk,
        salesValue: p.total_sales,
        qtyValue: p.total_qty || 0
      })));"""
      
    new_content = re.sub(pattern, replacement, content)
    
    # We also need to remove 'const maxVal = ...' since it's no longer used and causes unused variable warnings
    new_content = re.sub(r"const maxVal = products\.length > 0 \? Math\.max\(\.\.\.products\.map\(\(p: any\) => p\.total_sales\)\) : 1;\s*", "", new_content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated {os.path.basename(filepath)}")

for f in files:
    process_file(f)
