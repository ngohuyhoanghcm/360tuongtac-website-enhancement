const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');
const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

blogFiles.forEach(f => {
  const p = path.join(blogsDir, f);
  let content = fs.readFileSync(p, 'utf8');

  let lines = content.split('\\n');
  lines = lines.filter(line => line.trim() !== ','); // VERY CLEAR
  
  for (let i=0; i<lines.length; i++) {
     if (lines[i].includes('relatedServices:') && i > 0) {
        if (!lines[i-1].trim().endsWith(',')) {
           lines[i-1] = lines[i-1] + ',';
        }
     }
  }
  
  fs.writeFileSync(p, lines.join('\\n'));
});
console.log('Fixed using array filter');
