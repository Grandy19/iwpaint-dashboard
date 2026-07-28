import os
import re

def update_customer_page():
    filepath = r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\admin\CustomerPage.tsx"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add state for periodeAwal and periodeAkhir
    if "const [periodeAwal" not in content:
        content = re.sub(r"const \[area, setArea\] = useState\('Semua Area'\);",
                         r"const [periodeAwal, setPeriodeAwal] = useState('2026-01-01');\n  const [periodeAkhir, setPeriodeAkhir] = useState('2026-12-30');\n  const [area, setArea] = useState('Semua Area');",
                         content)

    # 2. Remove status state
    content = re.sub(r"const \[status, setStatus\] = useState\('Semua Status'\);\n\s*", "", content)

    # 3. Add periodeAwal and periodeAkhir to loadData dependencies
    if "[periodeAwal, periodeAkhir]" not in content:
        content = re.sub(r"useEffect\(\(\) => \{\n\s*loadData\(\);\n\s*\}, \[\]\);",
                         r"useEffect(() => {\n    loadData();\n  }, [periodeAwal, periodeAkhir]);",
                         content)
                         
    # 4. Add periodeAwal and periodeAkhir to loadTransactions dependencies
    if "[customerName, salesName, area, periodeAwal, periodeAkhir]" not in content:
        content = re.sub(r"\}, \[customerName, salesName, area\]\);",
                         r"}, [customerName, salesName, area, periodeAwal, periodeAkhir]);",
                         content)

    # 5. Add periode params to loadData
    if "params.periodeAwal = periodeAwal" not in content:
        load_data_replacement = """  const loadData = async () => {
    try {
      const params: any = {};
      if (periodeAwal) params.periodeAwal = periodeAwal;
      if (periodeAkhir) params.periodeAkhir = periodeAkhir;
      
      const customersRes = await api.get('/customers', { params });
      const txRes = await api.get('/transactions', { params });"""
        content = re.sub(r"  const loadData = async \(\) => \{\n\s*try \{\n\s*const customersRes = await api\.get\('/customers'\);\n\s*const txRes = await api\.get\('/transactions'\);",
                         load_data_replacement,
                         content)

    # 6. Add periode params to loadTransactions
    if "params.periodeAwal = periodeAwal" in content and "loadTransactions" in content:
        # Actually just find loadTransactions and add params
        content = re.sub(r"if \(area !== 'Semua Area'\) params\.area = area;",
                         r"if (area !== 'Semua Area') params.area = area;\n      if (periodeAwal) params.periodeAwal = periodeAwal;\n      if (periodeAkhir) params.periodeAkhir = periodeAkhir;",
                         content)

    # 7. Update UI to replace Status with Periode and use grid-cols-5
    ui_replacement = """            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm text-[#475569] font-medium mb-2">Periode</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input 
                      type="date" 
                      value={periodeAwal} 
                      onChange={(e) => setPeriodeAwal(e.target.value)} 
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="flex-1">
                    <input 
                      type="date" 
                      value={periodeAkhir} 
                      onChange={(e) => setPeriodeAkhir(e.target.value)} 
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
                <CustomSelect 
                  value={area} 
                  onChange={setArea} 
                  options={areaOptions} 
                />
              </div>"""
    
    # We replace from <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"> down to the end of the Status div
    content = re.sub(r'<div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">[\s\S]*?<label className="block text-sm text-\[#475569\] font-medium mb-2">Status</label>[\s\S]*?</CustomSelect>\n\s*</div>',
                     ui_replacement,
                     content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated CustomerPage.tsx")

if __name__ == "__main__":
    update_customer_page()
