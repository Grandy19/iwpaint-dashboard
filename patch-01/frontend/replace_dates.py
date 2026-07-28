import os
import glob

def replace_dates():
    search_dir = r"c:\PABW02\iwpaint\patch-01\frontend\src"
    
    # We want to replace '2026-07-01' with '2026-01-01'
    # And '2026-06-30' with '2026-12-30'
    
    files = glob.glob(os.path.join(search_dir, "**", "*.tsx"), recursive=True)
    files.extend(glob.glob(os.path.join(search_dir, "**", "*.ts"), recursive=True))
    
    count = 0
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "2026-07-01" in content or "2026-06-30" in content:
            new_content = content.replace("2026-07-01", "2026-01-01")
            new_content = new_content.replace("2026-06-30", "2026-12-30")
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {file_path}")
            count += 1
            
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    replace_dates()
