const fs = require('fs');
const path = require('path');

const prompts = {
  'viewer-that-vs-viewer-ao': 'Magnifying glass inspecting silhouettes vs robots, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'tin-hieu-tiktok-la-gi': 'Abstract 3D waves of binary code morphing into social media icons, 3D Isometric, Deep Navy background, Neon Gradients, tech, octane render'
};

async function generateImages() {
  const dir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [slug, prompt] of Object.entries(prompts)) {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
    console.log(`Downloading ${slug}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text')) {
        throw new Error(`Received text instead of image: ${contentType}`);
      }
      const buffer = await res.arrayBuffer();
      const filePath = path.join(dir, `${slug}.webp`);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`Saved ${slug}.webp (${buffer.byteLength} bytes)`);
    } catch (err) {
      console.error(`Failed to download ${slug}:`, err.message);
    }
  }
}

generateImages();
