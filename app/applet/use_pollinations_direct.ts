import * as fs from 'fs';
import * as path from 'path';

const dir = path.join(process.cwd(), 'data', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

for (const filename of files) {
  const filePath = path.join(dir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const altMatch = content.match(/alt:\s*['"](.*?)['"]/);
  if (!altMatch) continue;
  
  const alt = altMatch[1];
  
  const match = content.match(/featuredImage:\s*['"](.*?)['"]/);
  if (match) {
    const fullPrompt = `${alt}, 3D Isometric, Cyber-Clean Minimalism, Deep Navy background, signature gradients orange to pink, high-end tech textures`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1200&height=630&nologo=true`;
    
    content = content.replace(match[0], `featuredImage: '${url}'`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filename}`);
  }
}
