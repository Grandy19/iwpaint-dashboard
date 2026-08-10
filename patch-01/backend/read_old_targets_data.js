const fs = require('fs');
const content = fs.readFileSync('e:\\laragon\\www\\Project IWPAINT\\iwpainttest.sql', 'utf8');
const lines = content.split('\n');
console.log('Fact targets rows:');
let printing = false;
for (const line of lines) {
  if (line.includes('Dumping data for table `fact_targets`')) {
    printing = true;
  }
  if (printing) {
    console.log(line);
    if (line.includes('UNLOCK TABLES') || line.includes('COMMIT')) {
      break;
    }
  }
}
