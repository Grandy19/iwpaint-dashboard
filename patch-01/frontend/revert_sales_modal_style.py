import re
import os

def revert_style():
    filepath = r"c:\PABW02\iwpaint\patch-01\frontend\src\components\ui\SalesModal.tsx"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Change text-sm back to text-[13px] on labels
    content = re.sub(r'className="block text-sm text-\[#475569\] font-medium mb-2"', 
                     r'className="block text-[13px] text-[#475569] font-medium mb-2"', content)
                     
    # 2. Change all icon sizes from 18 to 16
    # Only for Lucide icons that were changed. We can just replace size={18} to size={16}
    content = content.replace('size={18}', 'size={16}')
    
    # 3. Change input/select styles from pl-11 pr-4 py-3 to pl-10 pr-4 py-2.5 text-[14px]
    # For bg-white
    content = content.replace(
        'w-full pl-11 pr-4 py-3 bg-white',
        'w-full pl-10 pr-4 py-2.5 text-[14px] bg-white'
    )
    # For bg-gray-50
    content = content.replace(
        'w-full pl-11 pr-4 py-3 bg-gray-50',
        'w-full pl-10 pr-4 py-2.5 text-[14px] bg-gray-50'
    )
    
    # Also handle the eye icon padding (pr-12 -> pr-10 isn't strictly necessary, but let's check)
    content = content.replace(
        'w-full pl-11 pr-12 py-3 bg-white',
        'w-full pl-10 pr-10 py-2.5 text-[14px] bg-white'
    )
    
    # 4. Grid gap change
    content = content.replace(
        'className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8"',
        'className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Reverted styles in SalesModal.tsx")

if __name__ == '__main__':
    revert_style()
