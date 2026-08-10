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

  // The broken HTML structure is:
  //                 <div className="flex-1">
  //                   <input ... />
  //               </div>
  //             </div>
  //             
  //             <div className="flex-1 w-full flex items-end">

  // I need to add one more </div> right before <div className="flex-1 w-full flex items-end">
  
  // Using Regex:
  // Find: </div>\s*</div>\s*<div className="flex-1 w-full flex items-end">
  const regex = /<\/div>\s*<\/div>\s*<div className="flex-1 w-full flex items-end">/g;
  content = content.replace(regex, '</div>\n              </div>\n            </div>\n            \n            <div className="flex-1 w-full flex items-end">');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Fixed missing div in ' + file);
  }
});
