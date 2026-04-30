const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');
const servicesDir = path.join(__dirname, 'data', 'services');

const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

function fixCommaStr(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/\\n,\\n\\s+relatedServices/g, ',\\n  relatedServices');
  newContent = newContent.replace(/],\\n,\\n\\s*relatedServices:/g, '],\\n  relatedServices:');
  newContent = newContent.replace(/[\\s\\n]+,\\n\\s+relatedServices:/g, ',\\n  relatedServices:');
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
  }
}

blogFiles.forEach(f => fixCommaStr(path.join(blogsDir, f)));
serviceFiles.forEach(f => fixCommaStr(path.join(servicesDir, f)));

console.log('Fixed additional commas');
