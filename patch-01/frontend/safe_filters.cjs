const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles.filter(f => f.endsWith('.tsx'));
}

const files = getAllFiles('src/pages');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Replace the Grid container with Flex Nowrap
  content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-\d+ gap-6 items-end">/g, 
    '<div className="flex flex-nowrap gap-4 lg:gap-6 items-end overflow-x-auto pb-2">');

  // 2. Add whitespace-nowrap to all labels in the filter section to prevent text wrapping
  content = content.replace(/<label className="block text-sm text-\[#475569\] font-medium mb-2">/g, 
    '<label className="block text-sm text-[#475569] font-medium mb-2 whitespace-nowrap">');

  // 3. For Periode: replace its wrapper and inject the divider RIGHT AFTER IT!
  // The Periode block is exactly this regex:
  const periodeRegex = /<div className="(?:md:col-span-2|col-span-1 md:col-span-2|col-span-2)(?: lg:col-span-2)?">\s*<label className="block text-sm text-\[#475569\] font-medium mb-2 whitespace-nowrap">Periode<\/label>\s*<div className="flex items-center gap-3">\s*<div className="flex-1">\s*<input([\s\S]*?)<\/div>\s*<span className="text-gray-[45]00 font-bold">-<\/span>\s*<div className="flex-1">\s*<input([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
  
  content = content.replace(periodeRegex, (match, p1, p2) => {
    // Add h-[42px] to inputs to match CustomSelect
    p1 = p1.replace(/px-4 py-2/, 'px-4 py-2 h-[42px] text-sm');
    p2 = p2.replace(/px-4 py-2/, 'px-4 py-2 h-[42px] text-sm');
    
    return `<div className="w-[280px] lg:w-[400px] flex-none">
              <label className="block text-sm text-[#475569] font-medium mb-2 whitespace-nowrap">Periode</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input${p1}</div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex-1">
                  <input${p2}</div>
              </div>
            </div>
            
            {/* Modern Divider */}
            <div className="hidden sm:block w-[2px] h-[32px] bg-slate-200 rounded-full mb-[5px] -ml-2 mr-2"></div>`;
  });

  // 4. Change all other columns to flex-1
  content = content.replace(/<div className="md:col-span-1(?: lg:col-span-1)?">/g, '<div className="flex-1">');
  content = content.replace(/<div className="col-span-1">/g, '<div className="flex-1">');
  content = content.replace(/<div className="md:col-span-2">/g, '<div className="flex-1 min-w-[200px]">'); // For Supervisor in Distributor pages which was col-span-2

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated filters in ' + file);
  }
});
