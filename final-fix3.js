const fs = require('fs');
const path = require('path');

const blogsDir = path.join(__dirname, 'data', 'blog');
const blogFiles = fs.readdirSync(blogsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

blogFiles.forEach(f => {
  const p = path.join(blogsDir, f);
  let content = fs.readFileSync(p, 'utf8');
  // replace any line that solely has comma (with optional spaces)
  content = content.replace(/^\\s*,\\s*$/gm, '');
  
  // ensure previous array ends with comma
  content = content.replace(/\\n\\s*relatedServices:/g, ',\\n  relatedServices:');
  content = content.replace(/,,\\n  relatedServices:/g, ',\\n  relatedServices:');
  
  fs.writeFileSync(p, content);
});
console.log('Fixed using regex multiline');
