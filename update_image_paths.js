const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'data', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

let updatedCount = 0;

for (const filename of files) {
  const filePath = path.join(dir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
  const slug = slugMatch ? slugMatch[1] : filename.replace('.ts', '');
  
  // Find the exact line matching featuredImage
  const match = content.match(/featuredImage:\s*['"]([^'"]+)['"]/);
  
  if (match) {
    const currentValue = match[1];
    const newPath = `/images/blog/${slug}.webp`;
    
    if (currentValue !== newPath) {
      content = content.replace(match[0], `featuredImage: '${newPath}'`);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} files.`);
