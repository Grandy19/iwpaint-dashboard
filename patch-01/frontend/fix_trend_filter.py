import os
import re

def update_files():
    # 1. Update formatters.ts
    formatters_path = r"c:\PABW02\iwpaint\patch-01\frontend\src\utils\formatters.ts"
    with open(formatters_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "formatDateIndo" not in content:
        content += "\nexport const formatDateIndo = (dateString: string) => {\n"
        content += "  if (!dateString) return '';\n"
        content += "  const date = new Date(dateString);\n"
        content += "  if (isNaN(date.getTime())) return dateString;\n"
        content += "  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];\n"
        content += "  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;\n"
        content += "};\n"
        
        with open(formatters_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated formatters.ts")

    # 2. Find and update pages
    pages_dir = r"c:\PABW02\iwpaint\patch-01\frontend\src\pages"
    
    for root, _, files in os.walk(pages_dir):
        for file in files:
            if file.endswith(".tsx"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                if "filterAktifLabel=" in content or "filterAktifLabel:" in content:
                    # Need to import formatDateIndo if we use it
                    original_content = content
                    
                    if "formatDateIndo" not in content:
                        # Find import from formatters
                        if "from '../../utils/formatters'" in content:
                            content = re.sub(r'import\s+\{(.*?)\}\s+from\s+[\'"]\.\./\.\./utils/formatters[\'"]', 
                                             r'import { \1, formatDateIndo } from \'../../utils/formatters\'', content)
                        elif "from '../../../utils/formatters'" in content:
                            content = re.sub(r'import\s+\{(.*?)\}\s+from\s+[\'"]\.\./\.\./\.\./utils/formatters[\'"]', 
                                             r'import { \1, formatDateIndo } from \'../../../utils/formatters\'', content)
                        else:
                            content = "import { formatDateIndo } from '../../utils/formatters';\n" + content
                            
                    # Replace filterAktifLabel={...} or filterAktifLabel="..."
                    content = re.sub(r'filterAktifLabel\s*=\s*(["\'`].*?["\'`]|{.*?})',
                                     r'filterAktifLabel={`${formatDateIndo(periodeAwal)} - ${formatDateIndo(periodeAkhir)}`}', 
                                     content)
                                     
                    if original_content != content:
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(content)
                        print(f"Updated {file}")

if __name__ == "__main__":
    update_files()
