const fs = require('fs');
const path = require('path');

const prompts = {
  'tiktok-shop-moi-khong-co-don': 'Glowing 3D shopping cart with floating orders, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'huong-dan-seeding-tiktok-shop-tu-a-z': '3D blueprint path to a trophy, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'case-study-tang-viewer-tiktok': '3D 25x glowing typography on dashboard, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech, octane render',
  'dich-vu-smm-nen-chon-loai-nao': '3D toolbox filled with social icons, 3D Isometric, Deep Navy background, Neon Gradients, high quality, tech'
};

async function generateImages() {
  const dir = path.join(process.cwd(), 'public', 'images', 'blog');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [slug, prompt] of Object.entries(prompts)) {
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true`;
    console.log(`Downloading ${slug}...`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
