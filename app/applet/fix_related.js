const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('data/blog').filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join('data/blog', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const slugMatch = content.match(/slug:\s*['"](.*?)['"]/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  
  content = content.replace(/relatedPosts:\s*\[(.*?)\],/, (match, p1) => {
    let rawItems = p1.split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
    let items = Array.from(new Set(rawItems));
    items = items.filter(i => i !== slug);
    // Pad if necessary (if there are fewer than 3)
    const allSlugs = files.map(f => f.replace('.ts', '')).filter(s => s !== slug);
    while (items.length < 3) {
      const candidates = allSlugs.filter(s => !items.includes(s));
      items.push(candidates[Math.floor(Math.random() * candidates.length)]);
    }
    return `relatedPosts: [${items.slice(0, 3).map(i => `'${i}'`).join(', ')}],`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}
