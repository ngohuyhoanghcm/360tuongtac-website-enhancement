const fs = require('fs');
const path = require('path');
const outDir = path.join(process.cwd(), 'public', 'images', 'blog');
const files = fs.readdirSync(outDir);
files.forEach(f => {
  console.log(f, fs.statSync(path.join(outDir, f)).size);
});
