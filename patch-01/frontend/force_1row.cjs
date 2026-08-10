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

  // Force NO WRAPPING AT ALL so it always stays on 1 row!
  content = content.replace(/flex flex-wrap md:flex-nowrap gap-6 items-end/g, 'flex flex-nowrap gap-4 lg:gap-6 items-end overflow-x-auto pb-2');
  
  // Make Periode a bit smaller if space is tight
  content = content.replace(/w-\[320px\] md:w-\[400px\] flex-none/g, 'w-[280px] lg:w-[400px] flex-none');

  // Make the divider ALWAYS visible (or at least hidden only on tiny mobile)
  content = content.replace(/<div className="hidden md:block w-\[2px\]/g, '<div className="hidden sm:block w-[2px]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
