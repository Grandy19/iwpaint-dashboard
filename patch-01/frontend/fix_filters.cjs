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

  // Replace lg:flex-nowrap with md:flex-nowrap and lg:w-[400px] with md:w-[400px]
  content = content.replace(/flex-wrap lg:flex-nowrap/g, 'flex-wrap xl:flex-nowrap');
  content = content.replace(/w-full lg:w-\[400px\]/g, 'w-full xl:w-[400px]');
  
  // Wait, actually I should use flex-col lg:flex-row to make it completely safe?
  // No, if they complained it was 2 rows, it's because it wrapped.
  // The user probably wants it to NEVER wrap, so md:flex-nowrap is better.
  content = content.replace(/flex-wrap xl:flex-nowrap/g, 'flex-wrap md:flex-nowrap');
  content = content.replace(/w-full xl:w-\[400px\]/g, 'w-[320px] md:w-[400px]');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
