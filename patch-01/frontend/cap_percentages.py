import os
import re

def cap_percentage_calculations():
    pages_dir = r"c:\PABW02\iwpaint\patch-01\frontend\src\pages"
    
    # Regex to find Math.round((X / Y) * 100) that is NOT already inside Math.min
    # Look for: Math.round((...) * 100)
    # We will replace it with: Math.min(Math.round((...) * 100), 100)
    
    for root, _, files in os.walk(pages_dir):
        for file in files:
            if file.endswith(".tsx"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # A bit tricky with regex, let's use a negative lookbehind if possible
                # Or just manually replace the exact string patterns we know
                # Let's find all occurrences of "Math.round(" and check if they're preceded by "Math.min("
                
                original_content = content
                
                # We can replace: `Math.round((a / b) * 100)` with `Math.min(Math.round((a / b) * 100), 100)`
                # Let's use a regex that matches `Math.round(([^()]+) \/ ([^()]+)\) \* 100\)`
                # Wait, there are multiple parentheses sometimes.
                # Let's just find `Math.round(` and process it carefully
                
                # Simpler regex:
                # `Math\.round\(\(.*? / .*?\) \* 100\)`
                
                def replacement(match):
                    full_match = match.group(0)
                    # Check if it's already inside Math.min
                    start_idx = match.start()
                    if start_idx >= 9 and content[start_idx-9:start_idx] == "Math.min(":
                        return full_match # unchanged
                    return f"Math.min({full_match}, 100)"
                
                new_content = re.sub(r'Math\.round\(\(.*?\s*/\s*.*?\)\s*\*\s*100\)', replacement, content)
                
                # Also handle targetPerfRes.data.percentage and others that come directly from API
                # in DistributorDashboardPage.tsx
                new_content = re.sub(r'targetPerfRes\.data\.percentage\s*\|\|\s*0', 
                                     r'Math.min(targetPerfRes.data.percentage || 0, 100)', new_content)
                new_content = re.sub(r'targetPerf\.percentage\s*\|\|\s*0', 
                                     r'Math.min(targetPerf.percentage || 0, 100)', new_content)
                new_content = re.sub(r'ringkasanData\.percentage', 
                                     r'Math.min(ringkasanData.percentage || 0, 100)', new_content)
                
                if new_content != original_content:
                    # Fix double Math.min if we accidentally did it
                    new_content = new_content.replace('Math.min(Math.min(', 'Math.min(').replace(', 100), 100)', ', 100)')
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated {file}")

if __name__ == "__main__":
    cap_percentage_calculations()
