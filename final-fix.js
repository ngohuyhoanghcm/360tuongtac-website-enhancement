const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');
const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

function finalFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\\n,\\n\\s+relatedServices/g, ',\\n  relatedServices');
  
  // Actually, let's just parse the last lines
  // Replace `],\n,\n  relatedServices` with `],\n  relatedServices`
  newContent = newContent.replace(/\\],\\n,\\n\\s+relatedServices/g, '],\\n  relatedServices');
  newContent = newContent.replace(/],\\n,\\n\\s+relatedServices/g, '],\\n  relatedServices');
  
  // Or look at line 41: \n,\n
  newContent = newContent.replace(/\\n,\\n\\s*relatedServices/g, ',\\n  relatedServices');

  // Let's just fix the exact line
  const lines = newContent.split('\\n');
  const filtered = lines.filter((line, i) => {
    if (line.trim() === ',') {
      const nextLine = lines[i+1];
      if (nextLine && nextLine.includes('relatedServices')) {
        return false; // remove the lone comma
      }
    }
    return true;
  });
  
  newContent = filtered.join('\\n');

  // ensure the previous line has a comma
  const finalLines = newContent.split('\\n');
  for (let i = 0; i < finalLines.length; i++) {
    if (finalLines[i].includes('relatedServices:')) {
       // check line above
       if (!finalLines[i-1].endsWith(',')) {
          finalLines[i-1] += ',';
       }
    }
  }

  fs.writeFileSync(filePath, finalLines.join('\\n'));
}

blogFiles.forEach(f => finalFix(path.join(blogsDir, f)));
console.log('Fixed syntax errors');
