const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');

const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

function finalFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.split('\\n');
  const filtered = lines.filter((line, i) => {
    if (line.trim() === ',') {
      return false; // remove all lone commas!
    }
    return true;
  });
  
  const finalLines = filtered;
  for (let i = 0; i < finalLines.length; i++) {
    if (finalLines[i].includes('relatedServices:') && i > 0) {
       let j = i - 1;
       while (j > 0 && finalLines[j].trim() === '') j--;
       if (!finalLines[j].endsWith(',')) {
          finalLines[j] += ',';
       }
    }
  }

  fs.writeFileSync(filePath, finalLines.join('\\n'));
}

blogFiles.forEach(f => finalFix(path.join(blogsDir, f)));
console.log('Fixed syntax errors');
