const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'data', 'blog');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

let updatedCount = 0;

for (const filename of files) {
  const filePath = path.join(dir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the featuredImage line
  // Example: featuredImage: 'Glowing 3D AI brain with TikTok-colored nodes.',
  const match = content.match(/featuredImage:\s*['"]([^'"]+)['"]/);
  
  if (match) {
    const currentValue = match[1];
    
    // If it's not already a URL
    if (!currentValue.startsWith('http') && !currentValue.startsWith('/')) {
      // Create a pollinations URL with the prompt, adding the vibe style requested by user
      const fullPrompt = `${currentValue}, 3D Isometric, Cyber-Clean Minimalism, Deep Navy background, signature gradients orange to pink, high-end tech textures`;
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1200&height=630&nologo=true`;
      
      content = content.replace(match[0], `featuredImage: '${url}'`);
      fs.writeFileSync(filePath, content, 'utf8');
      updatedCount++;
    }
  }
}

console.log(`Updated ${updatedCount} files.`);
