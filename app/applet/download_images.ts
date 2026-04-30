import * as fs from 'fs';
import * as path from 'path';

const dir = path.join(process.cwd(), 'data', 'blog');
const outDir = path.join(process.cwd(), 'public', 'images', 'blog');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

async function processFiles() {
  for (const filename of files) {
    const filePath = path.join(dir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/);
    const slug = slugMatch ? slugMatch[1] : filename.replace('.ts', '');
    
    const match = content.match(/featuredImage:\s*['"](https:\/\/[^'"]+)['"]/);
    
    if (match) {
      const url = match[1];
      const dest = path.join(outDir, `${slug}.webp`);
      console.log(`Downloading ${slug}...`);
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        
        content = content.replace(match[0], `featuredImage: '/images/blog/${slug}.webp'`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully processed ${slug}`);
      } catch (e) {
        console.error(`Failed to download ${url}:`, e);
      }
    }
  }
  console.log("All done.");
}

processFiles();
