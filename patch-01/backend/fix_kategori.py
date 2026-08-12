import re

with open('models/salesModel.js', 'r', encoding='utf-8') as f:
    content = f.read()

mapping_func = """
function mapKategoriDB(k) {
  if (!k) return k;
  const upper = k.toUpperCase();
  if (upper === 'INDUSTRI') return 'INDUSTRIAL';
  if (upper === 'AUTOMOTIVE') return 'AUTOMOTIVE';
  if (upper === 'DECORATIVE') return 'DECORATIVE';
  return upper;
}
"""

if "function mapKategoriDB" not in content:
    content = content.replace('const pool = require("../config/db");', 'const pool = require("../config/db");\n' + mapping_func)

content = content.replace('params.push(filters.kategori);', 'params.push(mapKategoriDB(filters.kategori));')

with open('models/salesModel.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated salesModel.js")
