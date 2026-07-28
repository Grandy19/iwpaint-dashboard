import os
import re

def insert_filter_aktif(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "filterAktifLabel=" not in content:
        # Import formatDateIndo
        if "from '../../utils/formatters'" in content:
            content = re.sub(r'import\s+\{(.*?)\}\s+from\s+[\'"]\.\./\.\./utils/formatters[\'"]', 
                             r'import { \1, formatDateIndo } from \'../../utils/formatters\'', content)
        elif "from '../../../utils/formatters'" in content:
            content = re.sub(r'import\s+\{(.*?)\}\s+from\s+[\'"]\.\./\.\./\.\./utils/formatters[\'"]', 
                             r'import { \1, formatDateIndo } from \'../../../utils/formatters\'', content)
        else:
            content = "import { formatDateIndo } from '../../utils/formatters';\n" + content
            
        # Add filterAktifLabel to <ChartCard
        content = re.sub(r'(<ChartCard[\s\S]*?)(/>)',
                         r'\1  filterAktifLabel={`${formatDateIndo(periodeAwal)} - ${formatDateIndo(periodeAkhir)}`}\n        \2', 
                         content)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {filepath}")

if __name__ == "__main__":
    files_to_update = [
        r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\sales\SalesCustomerPage.tsx",
        r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\supervisor\SupervisorCustomerPage.tsx",
        r"c:\PABW02\iwpaint\patch-01\frontend\src\pages\supervisor\SupervisorDashboardPage.tsx"
    ]
    for filepath in files_to_update:
        insert_filter_aktif(filepath)
