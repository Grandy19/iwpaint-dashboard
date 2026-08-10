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

  // The extra </div> is at the end of the filter section.
  // We can find it by looking for the transition from the filter section to the next section.
  // Wait, in update_filters.js I wrote:
  //           </div>
  //         </div>
  //         </div>
  // 
  //         {/* Dashboard Grid for KPI & Summary */} (or similar)
  // Let's replace triple </div> with double </div>, BUT ONLY if it's right before the next section.
  
  // A safer regex to remove the extra </div> that comes directly after the Filter Section:
  content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*({[\s\S]*?}|<div|<h3)/g, '</div>\n        </div>\n\n        $1');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Fixed extra div in ' + file);
  }
});
